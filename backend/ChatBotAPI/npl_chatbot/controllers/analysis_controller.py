from flask import Blueprint, request, jsonify
from services.nlp_services import analyze_text

bp_analysis = Blueprint("analysis", __name__)

@bp_analysis.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Texto não fornecido"}), 400

    result = analyze_text(text)
    return jsonify(result)