# 🎮 Promando - Monitor de Preços de Jogos

Um site para monitorar preços de jogos em várias plataformas e mostrar as melhores ofertas com links de afiliados.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Containerização**: Docker & Docker Compose

## 📋 Plataformas Suportadas

- Nuuvem
- Green Man Gaming
- Gamers Gate
- Instant Gaming
- Hype Games

## 🛠️ Setup Inicial

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### 1. Clone o repositório

```bash
cd c:\Users\fel9r\dev\promando
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o `.env` conforme necessário:
```env
DB_NAME=promando_dev
DB_USER=promando
DB_PASSWORD=promando_dev
VITE_API_URL=http://localhost:3001
```

### 3. Configure os arquivos .env em cada serviço

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

## 📦 Desenvolvimento

### Iniciar com Docker Compose

```bash
docker-compose up --build
```

Este comando irá:
- Iniciar PostgreSQL
- Iniciar Redis
- Compilar e rodar o Backend em http://localhost:3001
- Compilar e rodar o Frontend em http://localhost:5173

### Acessar a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

### Parar os containers

```bash
docker-compose down
```

### Logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🚢 Produção

### Iniciar com Docker Compose Produção

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Configure primeiro as variáveis de ambiente no arquivo `.env`:

```env
DB_NAME=promando_prod
DB_USER=promando_user
DB_PASSWORD=seu_senha_segura_aqui
API_URL=https://seu-dominio.com
```

O frontend estará disponível em `http://localhost:80`

## 📚 Estrutura do Projeto

```
promando/
├── backend/
│   ├── src/
│   │   ├── server.js          # Entrada principal
│   │   └── routes/            # Rotas da API
│   │       ├── games.js
│   │       ├── platforms.js
│   │       └── deals.js
│   ├── package.json
│   ├── Dockerfile.dev         # Build para desenvolvimento
│   ├── Dockerfile.prod        # Build para produção
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # Entrada React
│   │   ├── App.jsx            # Componente principal
│   │   ├── index.css          # Estilos globais
│   │   └── components/        # Componentes React
│   │       ├── GameList.jsx
│   │       └── PlatformFilter.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf             # Configuração nginx para produção
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   └── .env.example
├── docker-compose.yml         # Dev
├── docker-compose.prod.yml    # Produção
├── .env.example
└── README.md
```

## 🔌 APIs do Backend

### Games
- `GET /api/games` - Listar todos os jogos
- `GET /api/games/:id` - Obter detalhes de um jogo
- `POST /api/games` - Criar novo jogo

### Platforms
- `GET /api/platforms` - Listar todas as plataformas
- `GET /api/platforms/:id` - Detalhes de uma plataforma

### Deals
- `GET /api/deals` - Listar todas as ofertas ativas
- `GET /api/deals/trending` - Ofertas em alta

### Health Check
- `GET /health` - Verificar status do backend

## 🔄 Próximos Passos

1. **Integração com APIs das plataformas**
   - Conectar com APIs oficiais de Steam, Epic Games, etc.
   - Implementar web scraping se necessário

2. **Modelo de Banco de Dados**
   - Criar migrations para tabelas de jogos, preços, ofertas
   - Implementar relacionamentos entre entidades

3. **Sistema de Cache com Redis**
   - Cache de preços e ofertas
   - Invalidação de cache automática

4. **Autenticação e Autorização**
   - Sistema de login para usuários
   - JWT para proteger rotas

5. **Sistema de Recomendações**
   - Notificações de queda de preço
   - Wishlist de usuários

6. **Deploy**
   - Configurar CI/CD (GitHub Actions)
   - Deploy em cloud (AWS, Heroku, etc.)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📝 Licença

MIT License
