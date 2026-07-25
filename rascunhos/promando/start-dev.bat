@echo off
REM Inicializar Promando - Setup de Desenvolvimento (Windows)

echo 🎮 Promando - Inicializando projeto...

REM Copiar arquivos de environment
echo 📝 Configurando variáveis de ambiente...

if not exist ".env" (
  copy .env.example .env
  echo ✅ Arquivo .env criado (root)
)

if not exist "backend\.env" (
  copy backend\.env.example backend\.env
  echo ✅ Arquivo .env criado (backend)
)

if not exist "frontend\.env" (
  copy frontend\.env.example frontend\.env
  echo ✅ Arquivo .env criado (frontend)
)

REM Iniciar containers
echo.
echo 🐳 Iniciando Docker Compose...
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001
echo Health: http://localhost:3001/health
echo.

docker-compose up --build

echo.
echo ❌ Docker Compose finalizado
pause
