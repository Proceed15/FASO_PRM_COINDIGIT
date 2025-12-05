from flask import Blueprint, request, jsonify
from services.nlp_services import analyze_text
#from services.integration_service import buscar_cotacao_csharp # Importe o novo service
bp_analysis = Blueprint("analysis", __name__)

@bp_analysis.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Texto não fornecido"}), 400

    result = analyze_text(text)
    return jsonify(result)

bp_analysis = Blueprint("analysis", __name__)

@bp_analysis.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Texto não fornecido"}), 400

    # 1. Analisa o texto (NLP)
    nlp_result = analyze_text(text)
    
    # 2. Verifica a intenção detectada
    intent_data = nlp_result.get("intent_analysis", {})
    intent = intent_data.get("detected_intent")
    moeda = intent_data.get("detected_entity")

    final_response_text = "Desculpe, analisei seu texto mas não entendi o comando."

    # 3. Lógica de Decisão (Orquestração)
    if intent == "consultar_cotacao":
        if moeda:
            # Chama o C# usando a moeda que o NLP achou
            dados_csharp = buscar_cotacao_csharp(moeda)
            
            if dados_csharp:
                # Usa os campos exatos do seu DTO do C# (Price, Symbol, Name)
                # O Python lê keys do dict em minúsculo se você converteu no integration_service,
                # ou conforme vier do JSON (C# geralmente manda camelCase: price, symbol)
                nome = dados_csharp.get('nome') 
                sigla = dados_csharp.get('sigla')
                valor = dados_csharp.get('valor')
                
                response_text = f"Cotação atual: 1 {sigla} ({nome}) está valendo {valor:,.2f}."
            else:
                response_text = f"Desculpe, não consegui obter a cotação do {moeda} agora."
        else:
            response_text = "Entendi que você quer uma cotação, mas de qual moeda? (Ex: Dólar, Euro)"
    else:
        response_text = "Posso ajudar com cotações de moedas. Tente perguntar 'Valor do Dólar'."
    # 4. Adiciona a resposta final ao JSON de retorno
    nlp_result["bot_response"] = response_text
    
    return jsonify(nlp_result)
