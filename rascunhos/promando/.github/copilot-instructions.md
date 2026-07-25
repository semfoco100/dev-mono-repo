<!-- Use este arquivo para fornecer instruções customizadas do Copilot específicas deste workspace -->

## 🎮 Promando - Monitor de Preços de Jogos

### Sobre o Projeto
- Site para monitorar e comparar preços de jogos em múltiplas plataformas
- Stack: React + Node.js/Express + PostgreSQL
- Containerizado com Docker Compose para dev e produção

### Como Trabalhar Neste Projeto

#### Desenvolvimento
1. Usar `docker-compose up` para iniciar todos os serviços
2. Frontend em http://localhost:5173
3. Backend API em http://localhost:3001/api
4. PostgreSQL em localhost:5432

#### Estrutura de Pastas
```
backend/
  ├── src/
  │   ├── server.js      # Entrada principal
  │   └── routes/        # Definições de rotas
frontend/
  ├── src/
  │   ├── App.jsx        # Componente principal
  │   └── components/    # Componentes React
```

#### Próximas Prioridades
1. Criar migrations de BD para tabelas: games, platforms, prices, deals
2. Implementar integração com APIs das plataformas
3. Configurar Redis para cache de preços
4. Criar sistema de autenticação JWT

### Convenções
- Backend: Arquivo de rota separado por recurso
- Frontend: Componentes com hooks (useState, useEffect)
- Variables de ambiente: Usar `.env.example` como template
- Commits: Usar padrão conventional commits
