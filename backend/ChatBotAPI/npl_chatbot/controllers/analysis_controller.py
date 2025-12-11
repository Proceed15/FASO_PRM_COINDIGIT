from flask import Blueprint, request, jsonify
from services.nlp_services import processar_mensagem

bp_analysis = Blueprint("analysis", __name__)

@bp_analysis.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"erro": "Texto vazio"}), 400

    # Chama o serviço e retorna o resultado direto
    resultado = processar_mensagem(text)
    
    return jsonify(resultado)