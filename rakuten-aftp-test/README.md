# Rakuten AFTP Diagnostic

Projeto Node.js/TypeScript mínimo para validar acesso ao Product Catalog da Rakuten Advertising via AFTP.

## Como usar

```bash
cp .env.example .env
npm install
npm run dev
```

Configure `RAKUTEN_AFTP_USER` e `RAKUTEN_AFTP_PASSWORD` no `.env`.

O diagnóstico:

- tenta FTP, FTPS explícito e FTPS implícito contra `aftp.linksynergy.com`;
- lista diretórios e arquivos;
- procura arquivos relacionados ao MID `46796`;
- baixa um único `.gz` de exemplo;
- descompacta o arquivo;
- identifica XML ou TXT;
- exibe estatísticas básicas do catálogo.
