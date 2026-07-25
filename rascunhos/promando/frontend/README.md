# Promando - Monitor de Preços de Jogos 🎮

Sistema de monitoramento de preços para jogos em diferentes plataformas.

## 🚀 Tecnologias

- **Frontend**: React 18 com TypeScript
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **API Client**: Axios
- **Routing**: React Router v6
- **Code Quality**: ESLint + Prettier

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
   ```bash
   git clone <seu-repositorio>
   cd promando-frontend
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env.local
   ```

4. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

O projeto estará disponível em `http://localhost:5173`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Verifica o código com ESLint

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── GameList.tsx      # Lista de jogos com ofertas
│   └── PlatformFilter.tsx # Filtro por plataforma
├── App.tsx               # Componente principal
├── main.tsx              # Ponto de entrada
└── index.css             # Estilos globais (Tailwind)
```

## 🌍 Variáveis de Ambiente

- `VITE_API_URL` - URL da API (padrão: http://localhost:3001)

## 🎯 Funcionalidades

- ✅ Listagem de jogos em promoção
- ✅ Filtro por plataforma
- ✅ Exibição de preço original, preço com desconto e percentual
- ✅ Link para página da oferta
- ✅ Responsive design com Tailwind CSS
- ✅ Type-safe com TypeScript

## 🐳 Docker

Para rodar com Docker:

```bash
# Desenvolvimento
docker build -f Dockerfile.dev -t promando-frontend:dev .
docker run -p 5173:5173 promando-frontend:dev

# Produção
docker build -f Dockerfile.prod -t promando-frontend:prod .
docker run -p 80:80 promando-frontend:prod
```

## 📄 Licença

MIT
