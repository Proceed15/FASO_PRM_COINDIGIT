import requests

# Ajuste a URL para onde sua API C# está rodando
CSHARP_API_URL = "http://localhost:5000/api/financas/cotacao"

def buscar_cotacao_csharp(moeda: str):
    """
    Consome o endpoint que retorna CurrencySummaryDto
    Espera JSON: { "symbol": "BTC", "price": 350000.50, "name": "Bitcoin", ... }
    """
    try:
        # Normaliza para garantir que a busca seja consistente (ex: usd -> USD)
        url = f"{CSHARP_API_URL}/{moeda.upper()}"
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            dados = response.json()
            
            # Validação de segurança: verifica se o campo 'price' existe
            if 'price' in dados:
                return {
                    "sigla": dados.get("symbol"),  # Mapeia 'symbol' do DTO
                    "nome": dados.get("name"),     # Mapeia 'name' do DTO
                    "valor": dados.get("price"),   # Mapeia 'price' do DTO
                    "variacao": dados.get("change") # Mapeia 'change' do DTO
                }
            return None
        else:
            print(f"API retornou status: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Erro de conexão com API C#: {e}")
        return None





"""import requests
# URL da sua API C# (Ajuste conforme necessário)
CSHARP_API_URL = "http://localhost:5000/api/financas/cotacao"

def buscar_cotacao_csharp(moeda: str):
 
    Chama a API C# para buscar a cotação.
    Espera receber um JSON do C# tipo: {"sigla": "USD", "valor": 5.80}

    try:
        # Monta a URL: ex: .../cotacao/USD
        url = f"{CSHARP_API_URL}/{moeda}"
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            dados = response.json()
            # Retorna o dicionário direto do JSON do C#
            return dados 
        else:
            return None
    except Exception as e:
        print(f"Erro ao conectar com C#: {e}")
        return None
def integrar_cotacao(moeda: str):
    """
    Integra a cotação obtida da API C# com o sistema Python.
    """
    cotacao = buscar_cotacao_csharp(moeda)
    if cotacao:
        sigla = cotacao.get("sigla")
        valor = cotacao.get("valor")
        print(f"Cotação obtida da API C#: {sigla} = {valor}")
        # Aqui você pode adicionar lógica para salvar ou processar a cotação
        return cotacao
    else:
        print("Não foi possível obter a cotação da API C#.")
        return None
# Exemplo de uso
if __name__ == "__main__":
    moeda = "USD"
    integrar_cotacao(moeda)
# Aqui está o exemplo com USD"""