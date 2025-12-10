import requests
# from modelos import Currency, History (se estiver em outro arquivo)

def obter_cotacao_do_csharp(simbolo_moeda="BTCUSDT"):
    # URL da sua API C# (Ajuste a rota conforme seu Controller)
    # Exemplo: Se seu controller é CurrencyController e tem um GetBySymbol
    url = f"http://localhost:5002/api/currency/{simbolo_moeda}" 
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            dados_json = response.json()
            
            # --- A MÁGICA DO PYDANTIC ACONTECE AQUI ---
            # O Python tenta converter o JSON direto para a Classe Currency
            # Se o JSON do C# vier errado, isso aqui gera um erro explicativo
            moeda = Currency.model_validate(dados_json)
            
            # Exemplo de resposta formatada do Bot
            return f"O {moeda.name} ({moeda.symbol}) está lastreado em {moeda.backing}."
            
        else:
            return f"A API C# retornou erro: {response.status_code}"
            
    except Exception as e:
        return f"Erro ao processar dados: {e}"

# Teste
# print(obter_cotacao_do_csharp())
