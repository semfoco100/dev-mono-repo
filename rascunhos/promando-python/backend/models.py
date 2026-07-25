from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    image_url = Column(String)
    # Relacionamento com os preços de diferentes lojas
    prices = relationship("Price", back_populates="game")

class Price(Base):
    __tablename__ = "prices"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    store_name = Column(String) # Ex: "GamersGate", "Steam"
    current_price = Column(Float)
    base_price = Column(Float) # Preço sem desconto
    discount_percentage = Column(Integer)
    checkout_url = Column(String) # Seu link de afiliado
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    game = relationship("Game", back_populates="prices")