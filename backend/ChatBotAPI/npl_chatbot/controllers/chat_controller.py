# Arquivo: controllers/chat_controller.py (ou onde estiver sua rota)
from flask import Blueprint, request, jsonify
# Importe seu serviço de NLP atual e o novo serviço financeiro
from services import finance_service 
# from services import nlp_service (supondo que sua lógica NLP esteja aqui)

chat_bp = Blueprint('chat', __name__)

# Mapa para corrigir o que o usuário digita vs o que a API espera
MAPA_MOEDAS = {
    "BITCOIN": "BTC", "BTC": "BTC",
    "ETHEREUM": "ETH", "ETH": "ETH",
    "DÓLAR": "USDT", "USDT": "USDT"
}

@chat_bp.route('/analisar', methods=['POST'])
def analisar():
    dados = request.json
    texto_usuario = dados.get('texto', '')

    # 1. Chama seu NLP atual (que gera aquele JSON detalhado que você me mostrou)
    # resultado_nlp = nlp_service.analisar_texto(texto_usuario) 
    # VOU SIMULAR o resultado que você me mostrou para o exemplo funcionar:
    resultado_nlp = {
        "knowledge_discovery": {
            "named_entities": [["Bitcoin", "PERSON"]] # O erro do Spacy que vimos
        },
        # ... outros campos do seu JSON ...
    }

    # 2. Lógica de Integração (O "Pulo do Gato")
    moeda_detectada = None
    
    # Tenta achar nas entidades do NLP
    entidades = resultado_nlp.get("knowledge_discovery", {}).get("named_entities", [])
    for ent in entidades:
        termo = ent[0].upper() # Ex: "BITCOIN"
        if termo in MAPA_MOEDAS:
            moeda_detectada = MAPA_MOEDAS[termo]
            break
            
    # Fallback: Se o NLP falhou, vê se tem a palavra solta no texto
    if not moeda_detectada:
        palavras = texto_usuario.upper().split()
        for p in palavras:
            if p in MAPA_MOEDAS:
                moeda_detectada = MAPA_MOEDAS[p]
                break

    # 3. Se achou moeda, chama o Service do C#
    dados_financeiros = None
    if moeda_detectada:
        dados_financeiros = finance_service.buscar_cotacao(moeda_detectada)

    # 4. Injeta a resposta no JSON final
    resultado_nlp['financial_data'] = dados_financeiros
    
    return jsonify(resultado_nlp)