import uuid
from datetime import datetime
from core.models import nlp, sentiment_pipeline, tfidf_vectorizer
from core.models import DadosMoeda, Currency, History # Import your Pydantic models

# --- MOCK C# API RESPONSE ---
# Mimics exactly what a C# .NET Core API would return (PascalCase)
def buscar_no_csharp(symbol):
    print(f"DEBUG: Mocking C# call for {symbol}")
    
    if symbol in ["BTC", "ETH", "USD"]:
        # Note the keys are in PascalCase ('Symbol', 'Price') matching C# conventions.
        # Your Pydantic AliasChoices will handle mapping this to Python snake_case.
        mock_response = {
            "moeda": {
                "Symbol": symbol,
                "Name": "Bitcoin" if symbol == "BTC" else "Unknown",
                "Backing": "Digital Proof of Work"
            },
            "historico": [
                {
                    "CurrencyId": str(uuid.uuid4()),
                    "Price": 98000.50,
                    "Date": datetime.now().isoformat()
                },
                {
                    "CurrencyId": str(uuid.uuid4()),
                    "Price": 97500.20,
                    "Date": datetime.now().isoformat()
                }
            ]
        }
        return mock_response
        
    return {"erro": "Symbol not found in external API"}

def analyze_text(text: str):
    doc = nlp(text)

    # (NLP Logic remains the same as before...)
    tokens = [token.text for token in doc]
    lemmas = [token.lemma_ for token in doc]
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    noun_chunks = [chunk.text for chunk in doc.noun_chunks]
    
    sentiment = sentiment_pipeline(text)[0]

    return {
        "tokens": tokens,
        "lemmas": lemmas,
        "sentiment": sentiment,
        "knowledge_discovery": {
            "named_entities": entities,
            "noun_chunks": noun_chunks
        }
    }

def processar_mensagem(texto_usuario):
    # 1. NLP Analysis
    analise_nlp = analyze_text(texto_usuario)
    
    # 2. Look for opportunities to call C#
    dados_financeiros_validos = None
    entidades = analise_nlp.get("knowledge_discovery", {}).get("named_entities", [])
    
    for entidade in entidades:
        termo = entidade[0]
        # Logic: 3 letters, Uppercase (e.g., BTC)
        if len(termo) == 3 and termo.isupper():
            print(f"Detectei possível moeda: {termo}. Chamando API C#...")
            
            # A. Get Raw Data (Dict)
            raw_data = buscar_no_csharp(termo)
            
            if "erro" not in raw_data:
                try:
                    # B. PYDANTIC VALIDATION
                    # This converts strings to UUIDs, floats to Decimals, and parses Dates
                    modelo_validado = DadosMoeda.model_validate(raw_data)
                    
                    # C. Serialization for Frontend
                    # Convert Pydantic object back to a Dict safely (handling Decimals/Dates)
                    dados_financeiros_validos = modelo_validado.model_dump(mode='json')
                    break 
                except Exception as e:
                    print(f"Validation Error: {e}")
                    dados_financeiros_validos = {"erro": "Falha na validação dos dados C#"}

    # 3. Inject result
    analise_nlp["financial_data"] = dados_financeiros_validos
    
    return analise_nlp