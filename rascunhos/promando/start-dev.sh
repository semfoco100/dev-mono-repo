#!/bin/bash

# Inicializar Promando - Setup de Desenvolvimento

echo "🎮 Promando - Inicializando projeto..."

# Copiar arquivos de environment
echo "📝 Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "✅ Arquivo .env criado (root)"
fi

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo "✅ Arquivo .env criado (backend)"
fi

if [ ! -f "frontend/.env" ]; then
  cp frontend/.env.example frontend/.env
  echo "✅ Arquivo .env criado (frontend)"
fi

# Iniciar containers
echo ""
echo "🐳 Iniciando Docker Compose..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"
echo "Health: http://localhost:3001/health"
echo ""

docker-compose up --build

echo ""
echo "❌ Docker Compose finalizado"
