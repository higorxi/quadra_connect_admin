# Quadra Connect – Painel do Locador

Painel administrativo (React + TypeScript + Vite + Chakra UI) para donos e administradores de quadras cadastrarem unidades, acompanharem reservas e ver relatórios. Consome a API [quadra_connect_api](https://github.com/higorxi/quadra_connect_api).

## Pré-requisitos

- Node.js 20+
- Yarn
- A API do Quadra Connect rodando (padrão `http://localhost:3000`)

## Configuração

Crie um arquivo `.env` na raiz:

```
VITE_API_URL=http://localhost:3000
```

Se `VITE_API_URL` não for definida, o painel usa `http://localhost:3000`.

## Executar

```bash
yarn install
yarn start:dev   # servidor de desenvolvimento do Vite
yarn build       # build de produção (tsc + vite)
yarn lint
```

## Executar o sistema completo

1. Suba a API (`quadra_connect_api`) e confirme que ela responde.
2. Suba este painel com `yarn start:dev`.
3. Suba a aplicação do cliente (`quadra-connect`) com `npm run dev`.

A API só aceita CORS das origens listadas em `src/main.ts` (em desenvolvimento, `localhost:5173`); se o Vite subir em outra porta, ajuste essa lista.
