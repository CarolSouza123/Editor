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

## Uso

1. Colar a chave da OpenAI no passo 1 da página e salvar (fica só naquele aparelho).
2. Enviar o vídeo (até 1080p).
3. Ajustar sensibilidade, silêncio mínimo e respiro, e analisar.
4. Transcrever para gerar a legenda e, se quiser, desmarcar frases para cortar repetições.
5. Exportar. O resultado sai em WebM (ou MP4 em alguns navegadores) e há um botão para converter para MP4.

Nunca coloque a chave da OpenAI dentro do código nem no repositório. Ela só vai no campo da página.
