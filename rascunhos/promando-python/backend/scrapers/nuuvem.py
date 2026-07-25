from playwright.sync_api import sync_playwright

def fetch_nuuvem_prices():
    # URL específica para jogos de Steam que você passou
    url = "https://www.nuuvem.com/br-pt/catalog/platforms/pc/drm/steam"
    games_extracted = []
    
    with sync_playwright() as p:
        print("Nuuvem: Iniciando Browser...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
            
            # Aguarda o card principal que você identificou
            page.wait_for_selector(".game-card", timeout=20000)
            
            # Seleciona todos os artigos de jogo
            cards = page.query_selector_all(".game-card")
            print(f"Nuuvem: Encontrados {len(cards)} cards de jogo.")

            for card in cards:
                try:
                    # Nome
                    title = card.query_selector(".game-card__product-name").inner_text().strip()
                    
                    # Imagem
                    image = card.query_selector(".game-cover__item--banner").get_attribute("src")
                    
                    # Preço Atual (R$ 15,00 -> 15.00)
                    price_text = card.query_selector(".product-price--val").inner_text()
                    current_price = float(price_text.replace('R$', '').replace('.', '').replace(',', '.').strip())
                    
                    # Preço Antigo (opcional)
                    old_price_el = card.query_selector(".product-price--old")
                    base_price = current_price
                    if old_price_el:
                        old_price_text = old_price_el.inner_text()
                        base_price = float(old_price_text.replace('R$', '').replace('.', '').replace(',', '.').strip())

                    # Desconto
                    discount_el = card.query_selector(".product-price--discount")
                    discount = 0
                    if discount_el:
                        discount = int(discount_el.inner_text().replace('-', '').replace('%', '').strip())

                    # Link (está no pai do game-card ou em um seletor próximo)
                    # Na Nuuvem, o link geralmente envolve o card. Vamos buscar o link mais próximo.
                    link_el = card.evaluate_handle("node => node.closest('a')")
                    link = link_el.as_element().get_attribute("href") if link_el.as_element() else ""

                    games_extracted.append({
                        "title": title,
                        "current_price": current_price,
                        "base_price": base_price,
                        "discount": discount,
                        "url": link if link.startswith("http") else f"https://www.nuuvem.com{link}",
                        "image": image
                    })
                except Exception as e:
                    continue
            
            print(f"Nuuvem: Extração finalizada. Total: {len(games_extracted)}")
        except Exception as e:
            print(f"Nuuvem: Erro ao carregar página: {e}")
        finally:
            browser.close()
            
    return games_extracted