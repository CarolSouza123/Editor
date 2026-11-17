// Corta Silêncio, API da nuvem (Cloudflare Pages Functions)
// Ligações esperadas no projeto Pages (Settings, Bindings):
//   DB     -> banco D1 (guarda os dados dos projetos)
//   BUCKET -> depósito R2 (guarda os arquivos de vídeo)
// Variável secreta (Settings, Environment variables, Production):
//   ACCESS_KEY -> código de acesso definido pela dona da página
// A tabela é criada sozinha na primeira chamada, não precisa rodar SQL na mão.

function json(data, status){
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function validId(id){ return /^[A-Za-z0-9_-]{1,64}$/.test(id || ""); }

async function ensureSchema(env){
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT, meta TEXT, updated_at INTEGER)"
  ).run();
}

export async function onRequest(context){
  const { request, env } = context;
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean); // ["api", ...]
  const rest = parts.slice(1);

  if(!env.ACCESS_KEY) return json({ error: "nuvem_nao_configurada", detail: "ACCESS_KEY ausente" }, 503);
  if(!env.DB) return json({ error: "nuvem_nao_configurada", detail: "ligação DB ausente" }, 503);
  if(!env.BUCKET) return json({ error: "nuvem_nao_configurada", detail: "ligação BUCKET ausente" }, 503);
  if(request.headers.get("x-access-key") !== env.ACCESS_KEY) return json({ error: "codigo_invalido" }, 401);

  try { await ensureSchema(env); } catch(e){ return json({ error: "banco_indisponivel" }, 503); }

  try {
    // GET /api/projects : lista os projetos salvos na nuvem
    if(rest.length === 1 && rest[0] === "projects" && request.method === "GET"){
      const res = await env.DB.prepare("SELECT meta FROM projects ORDER BY updated_at DESC").all();
      const list = (res.results || []).map(r => {
        try { return JSON.parse(r.meta); } catch(e){ return null; }
      }).filter(Boolean);
      return json({ projects: list });
    }

    if(rest.length >= 2 && rest[0] === "projects"){
      const id = rest[1];
      if(!validId(id)) return json({ error: "id_invalido" }, 400);

      // PUT /api/projects/:id : salva ou atualiza os dados do projeto
      if(rest.length === 2 && request.method === "PUT"){
        const meta = await request.json();
        if(!meta || meta.id !== id) return json({ error: "meta_invalida" }, 400);
        await env.DB.prepare(
          "INSERT INTO projects (id, name, meta, updated_at) VALUES (?, ?, ?, ?) " +
          "ON CONFLICT(id) DO UPDATE SET name = excluded.name, meta = excluded.meta, updated_at = excluded.updated_at"
        ).bind(id, String(meta.name || ""), JSON.stringify(meta), Number(meta.updatedAt || Date.now())).run();
        return json({ ok: true });
      }

      // GET /api/projects/:id : lê os dados de um projeto
      if(rest.length === 2 && request.method === "GET"){
        const row = await env.DB.prepare("SELECT meta FROM projects WHERE id = ?").bind(id).first();
        if(!row) return json({ error: "nao_encontrado" }, 404);
        return json(JSON.parse(row.meta));
      }

      // DELETE /api/projects/:id : apaga projeto, vídeo e final da nuvem
      if(rest.length === 2 && request.method === "DELETE"){
        await env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
        await env.BUCKET.delete("projects/" + id + "/video");
        await env.BUCKET.delete("projects/" + id + "/final");
        return json({ ok: true });
      }

      // PUT e GET /api/projects/:id/video e /api/projects/:id/final : arquivos no R2
      if(rest.length === 3 && (rest[2] === "video" || rest[2] === "final")){
        const key = "projects/" + id + "/" + rest[2];
        if(request.method === "PUT"){
          const type = request.headers.get("content-type") || "application/octet-stream";
          await env.BUCKET.put(key, request.body, { httpMetadata: { contentType: type } });
          return json({ ok: true });
        }
        if(request.method === "GET"){
          const obj = await env.BUCKET.get(key);
          if(!obj) return json({ error: "arquivo_nao_encontrado" }, 404);
          const headers = new Headers();
          headers.set("content-type", (obj.httpMetadata && obj.httpMetadata.contentType) || "application/octet-stream");
          headers.set("cache-control", "no-store");
          if(obj.size) headers.set("content-length", String(obj.size));
          return new Response(obj.body, { headers });
        }
      }
    }

    return json({ error: "rota_nao_encontrada" }, 404);
  } catch(e){
    return json({ error: "falha_interna", detail: String((e && e.message) || e) }, 500);
  }
}
