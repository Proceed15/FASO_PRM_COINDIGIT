# Arquivo: services/finance_service.py
import requests
from core.models import Currency

# URL da sua API C#
CSHARP_API_URL = "http://localhost:5002/api/currency"

def buscar_cotacao(simbolo: str) -> dict:
    """
    Busca uma moeda na API C# e retorna um dicionário validado.
    """
    url = f"{CSHARP_API_URL}/{simbolo.upper()}"
    
    try:
        response = requests.get(url, timeout=3)
        
        if response.status_code == 200:
            # O Pydantic valida os dados que vieram do C#
            moeda = Currency.model_validate(response.json())
            return moeda.model_dump()
            
        return None # Retorna None se não achar (404)
        
    except Exception as e:
        print(f"Erro ao conectar com C#: {e}")
        return {"erro": str(e)}