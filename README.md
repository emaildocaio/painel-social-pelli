# Painel de Redes — Renato Pellizzari (privado)

Painel **privado** de gestão das redes sociais (Instagram @renatopellizzari),
separado do painel público da campanha. Acesso restrito a um grupo pequeno via
**senha**.

## Como funciona

- É um site estático (Next.js `output: export`, GitHub Pages). A página é só a
  "casca" — **nenhum dado sensível vem no build**.
- Ao abrir, pede uma **senha**. Com a senha, o painel busca os dados de um
  **feed protegido** servido pelo n8n (`/webhook/feed-social-pelli?key=<senha>`).
  Sem a senha, o feed responde `401` e o painel não mostra nada.
- Os dados (perfil, seguidores, posts, engajamento) são coletados a cada 6h por
  um workflow do n8n a partir da API do Instagram e guardados em Data Tables.

## Trocar a senha de acesso

A senha é validada no n8n, no workflow **"Pelli IG — Feed protegido"**, no node
**"Senha correta?"**. Basta alterar o valor comparado ali — a mesma senha é a
que o grupo digita no painel.

## Rodar local

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy

Push na `main` → GitHub Actions builda o export estático e publica no Pages
(`emaildocaio.github.io/painel-social-pelli`). Habilite Pages: Settings → Pages →
Source: **GitHub Actions**.
