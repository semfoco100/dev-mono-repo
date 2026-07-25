import requests
import xml.etree.ElementTree as ET

def fetch_gamersgate_prices(affiliate_id="f9141ef0085787fdb13e391287af555ac8272b29"):
    url = f"https://feeds.gamersgate.com/feeds/products?country=BRA&aff={affiliate_id}"
    try:
        print(f"GG: Baixando XML...")
        response = requests.get(url, timeout=30)
        root = ET.fromstring(response.content)
        
        # No seu XML, os jogos estão dentro de <item>
        items = root.findall(".//item")
        print(f"GG: Itens encontrados no XML: {len(items)}")
        
        games_extracted = []
        for item in items:
            try:
                # Extração baseada no XML que você enviou
                title = item.find('title').text
                current_price = float(item.find('price').text)
                base_price = float(item.find('srp').text)
                link = item.find('link').text
                image = item.find('boximg').text
                
                discount = 0
                if base_price > current_price:
                    discount = int(((base_price - current_price) / base_price) * 100)

                games_extracted.append({
                    "title": title,
                    "current_price": current_price,
                    "base_price": base_price,
                    "discount": discount,
                    "url": link,
                    "image": image
                })
            except Exception as e:
                # print(f"GG: Erro em um item: {e}")
                continue
        
        print(f"GG: Processamento concluído. Sucesso em {len(games_extracted)} jogos.")
        return games_extracted
    except Exception as e:
        print(f"GG: Erro crítico: {e}")
        return []