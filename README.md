# Corta Silêncio

Editor de vídeo em um único arquivo `index.html`. Remove silêncios pela onda do áudio,
cria legenda automática com a API da OpenAI e permite cortar trechos pela legenda.
Tudo roda no navegador do celular, nenhum vídeo é enviado para servidor.
A única saída é o áudio na hora da transcrição, direto para a OpenAI com a chave da usuária.

## Como publicar no GitHub (igual aos outros projetos)

1. Criar um repositório novo no GitHub, por exemplo `corta-silencio` (público, o código não tem nenhuma chave).
2. Enviar o arquivo `index.html` para a raiz do repositório.
3. Para gerar o link:
   - GitHub Pages: Settings, Pages, Source: Deploy from a branch, branch `main`, pasta `/ (root)`, Save.
   - Ou Cloudflare Pages conectando o repositório, como no LinkFacil (build command vazio, output `/`).
4. Abrir o link gerado no celular e usar. Dá para adicionar à tela inicial.

## Memória e projetos

Cada vídeo vira um projeto salvo automaticamente no navegador daquele aparelho, naquele
endereço de página: ajustes de corte, legenda transcrita e editada, vídeo original e,
depois de exportar, o vídeo final. Dá para fechar e continuar depois sem transcrever
de novo. Na lista "Meus projetos salvos": Editar reabre o projeto para corrigir e
exportar de novo (inclusive depois de já exportado), Duplicar cria uma cópia
independente e Apagar remove o projeto e os arquivos dele do navegador.
Limpar os dados do navegador ou trocar o endereço da página apaga os projetos salvos,
então baixe sempre o vídeo final que for usar.

## Uso

1. Colar a chave da OpenAI no passo 1 da página e salvar (fica só naquele aparelho).
2. Enviar o vídeo (até 1080p).
3. Ajustar sensibilidade, silêncio mínimo e respiro, e analisar.
4. Transcrever para gerar a legenda e, se quiser, desmarcar frases para cortar repetições.
5. Exportar. O resultado sai em WebM (ou MP4 em alguns navegadores) e há um botão para converter para MP4.

Nunca coloque a chave da OpenAI dentro do código nem no repositório. Ela só vai no campo da página.

## Nuvem na Cloudflare

A página pode salvar os projetos também na nuvem da dona da conta Cloudflare:
os dados dos projetos ficam num banco D1 e os arquivos de vídeo num depósito R2,
protegidos por um código de acesso pessoal (variável ACCESS_KEY no projeto Pages).
O código da API fica em functions/api, a referência da tabela em schema.sql, e os
passos de ligação no painel estão em CLOUDFLARE-PASSOS.md. Sem as ligações feitas,
a página segue salvando só no aparelho, sem quebrar nada.
