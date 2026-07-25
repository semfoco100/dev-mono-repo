from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Pega a URL do banco das variáveis de ambiente (definidas no docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/game_tracker")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)