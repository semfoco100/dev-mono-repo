# 🚀 Guia Rápido - Promando

## Seu Projeto está Pronto! ✅

### Estrutura Criada

✅ **Backend**
- Express.js com rotas para games, platforms e deals
- Dockerfiles para dev e produção
- Estrutura de pastas para models, middleware e utils

✅ **Frontend**
- React com Vite
- Componentes: GameList e PlatformFilter
- Estilos modernos e responsivos
- Dockerfiles para dev e produção com Nginx

✅ **Infraestrutura**
- `docker-compose.yml` para desenvolvimento
- `docker-compose.prod.yml` para produção
- PostgreSQL, Redis, Backend e Frontend orquestrados
- Hot reload em desenvolvimento

---

## 🏃 Começar em 3 Passos

### 1. Configure as Variáveis de Ambiente

No Windows, execute:
```bash
start-dev.bat
```

Isso vai:
- Copiar `.env.example` para `.env`
- Copiar configurações do backend e frontend
- Iniciar todos os containers

### 2. Acesse a Aplicação

Assim que os containers estiverem rodando:
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3001/api
- 💚 **Health Check**: http://localhost:3001/health

### 3. Desenvolva!

Qualquer alteração em `frontend/src` ou `backend/src` vai recarregar automaticamente.

---

## 📦 Comandos Úteis

```bash
# Iniciar desenvolvimento
docker-compose up --build

# Parar tudo
docker-compose down

# Ver logs
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Produção
docker-compose -f docker-compose.prod.yml up --build
```

---

## 🛠️ O que vem Depois

Confira o [README.md](README.md) para um guia completo!

### Próximas Tarefas (prioridade)

1. **Banco de Dados**
   - Criar migrations para tabelas: games, platforms, prices, deals
   - Arquivo: `backend/src/migrations/`

2. **Integrações com Plataformas**
   - APIs: Nuuvem, Green Man Gaming, Gamers Gate, Instant Gaming, Hype Games
   - Ou Web Scraping se necessário

3. **Sistema de Cache**
   - Redis já está configurado
   - Implementar cache de preços

4. **Autenticação**
   - JWT para proteger rotas
   - Login de usuários

5. **Deploy**
   - GitHub Actions para CI/CD
   - AWS, Heroku ou seu servidor preferido

---

## 📁 Estrutura do Projeto

```
promando/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/          # Games, Platforms, Deals
│   │   ├── models/          # Modelos de dados
│   │   ├── middleware/      # Autenticação, validação
│   │   ├── utils/           # Funções utilitárias
│   │   └── migrations/      # Migrations de BD
│   ├── package.json
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # App principal
│   │   ├── main.jsx
│   │   ├── index.css        # Estilos globais
│   │   └── components/      # GameList, PlatformFilter
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
│
├── docker-compose.yml       # Desenvolvimento
├── docker-compose.prod.yml  # Produção
├── .env.example
├── .github/
│   └── copilot-instructions.md
└── README.md
```

---

## 🔗 Links Importantes

- [README Completo](README.md) - Documentação detalhada
- [Tarefas Pendentes](.github/TODO.md) - Checklist de desenvolvimento

---

## 💡 Dicas

1. **Variáveis de Ambiente**: Sempre crie `.env` baseado em `.env.example`
2. **Hot Reload**: O código é automaticamente recarregado em desenvolvimento
3. **Logs**: Use `docker-compose logs -f` para debugar problemas
4. **Produção**: Configure senhas seguras antes de fazer deploy

---

## 🤔 Precisa de Ajuda?

Veja o [README.md](README.md) para mais detalhes sobre arquitetura, APIs e próximos passos!

Happy coding! 🎮
