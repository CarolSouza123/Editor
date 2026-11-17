# Ligar a nuvem do Corta Silêncio na Cloudflare

O site já está no ar em meueditorpessoal.pages.dev, ligado ao repositório Editor.
Falta só ligar as duas peças da nuvem e criar o código de acesso.
A página continua funcionando normalmente enquanto isso não é feito, salvando só no aparelho.

## Passo 1, criar o banco de dados

1. Painel da Cloudflare, menu Workers & Pages, aba D1.
2. Criar banco, nome: editor-db.
3. Não precisa rodar nenhum comando: a tabela é criada sozinha na primeira vez que a página usar a nuvem.

## Passo 2, criar o depósito de vídeos

1. Painel da Cloudflare, menu R2.
2. Se ele pedir para ativar o R2 na conta, ativa: o plano gratuito inclui 10 GB e não cobra dentro dele.
3. Criar depósito (bucket), nome: editor-videos.

## Passo 3, ligar os dois ao site

1. Workers & Pages, abre o projeto meueditorpessoal.
2. Settings, Bindings, adicionar ligação do tipo D1: nome da variável exatamente DB, banco editor-db. Salvar.
3. Adicionar ligação do tipo R2: nome da variável exatamente BUCKET, depósito editor-videos. Salvar.

## Passo 4, criar o código de acesso

1. No mesmo projeto, Settings, Environment variables, Production.
2. Nova variável: nome ACCESS_KEY, valor um código que você inventar (vale anotar, é ele que a página pede).
3. Marcar como secreta (Encrypt) e salvar.

## Passo 5, republicar

1. Aba Deployments do projeto.
2. No deploy mais recente, menu de três pontos, Retry deployment.
   Sem isso as ligações novas não valem.

## Passo 6, testar na página

1. Abrir meueditorpessoal.pages.dev, seção 6, Nuvem.
2. Digitar o mesmo código do passo 4 e tocar em Guardar o código neste aparelho.
3. Tocar em Ver projetos na nuvem: tem que responder sem erro, mesmo que a lista esteja vazia.
4. Abrir um projeto e tocar em Enviar o projeto aberto agora: ele sobe dados e vídeos.
5. Conferir de novo em Ver projetos na nuvem: o projeto aparece na lista.
