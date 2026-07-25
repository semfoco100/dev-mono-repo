from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware # IMPORTANTE
from database import SessionLocal, engine
import models
from scrapers.gamersgate import fetch_gamersgate_prices
from scrapers.nuuvem import fetch_nuuvem_prices

# Cria as tabelas
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CONFIGURAÇÃO DE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, mude para o seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINT QUE FALTAVA ---
@app.get("/games")
def get_games(db: Session = Depends(get_db), limit: int = 12):
    # Pegamos os jogos e carregamos os preços associados
    games = db.query(models.Game).limit(limit).all()
    
    output = []
    for game in games:
        # Se o jogo tiver preços, pegamos o primeiro (ou o menor depois)
        price_info = game.prices[0] if game.prices else None
        if price_info:
            output.append({
                "id": game.id,
                "title": game.title,
                "image": game.image_url,
                "store": price_info.store_name,
                "price": price_info.current_price,
                "base_price": price_info.base_price,
                "discount": price_info.discount_percentage,
                "url": price_info.checkout_url
            })
    return output


# Função auxiliar para evitar repetição de código (DRY)
def save_to_db(db: Session, item: dict, store_name: str):
    try:
        # 1. Verifica/Cria Jogo
        game = db.query(models.Game).filter(models.Game.title == item['title']).first()
        if not game:
            game = models.Game(title=item['title'], image_url=item['image'])
            db.add(game)
            db.flush() # Sincroniza para obter o ID sem fechar a transação

        # 2. Verifica/Atualiza Preço
        price_entry = db.query(models.Price).filter(
            models.Price.game_id == game.id, 
            models.Price.store_name == store_name
        ).first()

        if price_entry:
            price_entry.current_price = item['current_price']
            price_entry.discount_percentage = item['discount']
            price_entry.checkout_url = item['url']
        else:
            price_entry = models.Price(
                game_id=game.id,
                store_name=store_name,
                current_price=item['current_price'],
                base_price=item['base_price'],
                discount_percentage=item['discount'],
                checkout_url=item['url']
            )
            db.add(price_entry)
        return True
    except Exception as e:
        db.rollback()
        print(f"Erro ao salvar jogo {item.get('title')} da {store_name}: {e}")
        return False

@app.get("/sync/gamersgate")
def sync_gamersgate(db: Session = Depends(get_db)):
    print("Iniciando Sincronização GamersGate...")
    products = fetch_gamersgate_prices()
    
    if not products:
        return {"message": "0 jogos extraídos da GamersGate"}

    success_count = 0
    for item in products:
        if save_to_db(db, item, "GamersGate"):
            success_count += 1
            # Commit em lotes para performance e segurança
            if success_count % 100 == 0:
                db.commit()

    db.commit()
    return {"message": f"Sincronizados {success_count} jogos da GamersGate"}

@app.get("/sync/nuuvem")
def sync_nuuvem(db: Session = Depends(get_db)):
    print("Iniciando Sincronização Nuuvem...")
    products = fetch_nuuvem_prices()
    
    if not products:
        return {"message": "0 jogos extraídos da Nuuvem"}

    success_count = 0
    for item in products:
        if save_to_db(db, item, "Nuuvem"):
            success_count += 1

    db.commit()
    return {"message": f"Sincronizados {success_count} jogos da Nuuvem"}