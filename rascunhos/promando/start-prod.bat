@echo off
REM Iniciar Promando em Produção (Windows)

setlocal enabledelayedexpansion

echo 🎮 Promando - Modo Produção

if not exist ".env" (
  echo ❌ Arquivo .env não encontrado!
  echo Copie .env.example para .env e configure as variáveis
  pause
  exit /b 1
)

echo 🐳 Iniciando Docker Compose (Produção)...
echo.
echo Frontend: http://localhost:80
echo Backend: http://localhost:3001
echo.

docker-compose -f docker-compose.prod.yml up --build

echo.
echo ❌ Docker Compose finalizado
pause
