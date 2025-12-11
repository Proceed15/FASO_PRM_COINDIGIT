import requests
import spacy
from datetime import datetime

# Carrega o Spacy
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

API_URL = "http://localhost:5002/api/Currency"

def processar_mensagem(texto_usuario):
    # 1. Extrair a Sigla (ex: BTC, USDC)
    doc = nlp(texto_usuario.upper())
    sigla_encontrada = None

    for token in doc:
        # Ignora palavras comuns
        if token.text in ["QUAL", "VALOR", "PRECO", "PRICE", "COTO", "AGORA", "DO", "DA"]:
            continue
        
        # Pega palavras entre 3 e 5 letras
        if 3 <= len(token.text) <= 5 and token.text.isalpha():
            sigla_encontrada = token.text
            break
    
    if not sigla_encontrada:
        return {"erro": "Não entendi qual moeda você quer. Tente 'Valor do BTC'."}

    # 2. Buscar dados na API C#
    try:
        print(f"DEBUG: Buscando dados para {sigla_encontrada}...")
        response = requests.get(API_URL, timeout=5)
        
        if response.status_code != 200:
            return {"erro": f"Erro na API C#: Status {response.status_code}"}
        
        lista_moedas = response.json()
        
    except Exception as e:
        return {"erro": f"API Offline ou erro de conexão: {str(e)}"}

    # 3. Filtrar e Extrair Preço do Histórico
    moeda_encontrada = None

    for item in lista_moedas:
        # A API retorna "symbol": "USDC" na raiz
        sym = item.get("symbol")
        
        if sym == sigla_encontrada:
            moeda_encontrada = item
            break
    
    if moeda_encontrada:
        # AQUI ESTAVA O PROBLEMA: O preço está dentro de "histories"
        historicos = moeda_encontrada.get("histories", [])
        
        if not historicos or len(historicos) == 0:
             return {"erro": f"Encontrei {sigla_encontrada}, mas ela não possui histórico de preços cadastrado."}

        # Lógica para pegar o preço mais recente:
        # Ordenamos a lista de históricos pela data (campo 'date') de forma decrescente (reverse=True)
        # Assumindo que a data vem no formato ISO string (ex: "2025-06-10T...") que é ordenável como string
        try:
            ultimo_historico = sorted(historicos, key=lambda x: x['date'], reverse=True)[0]
            price = ultimo_historico.get("price")
            
            return {
                "symbol": sigla_encontrada,
                "price": price 
            }
        except Exception as e:
             return {"erro": f"Erro ao ler histórico da moeda: {str(e)}"}

    else:
        return {"erro": f"Moeda '{sigla_encontrada}' não encontrada na API."}
        