from core.models import nlp, sentiment_pipeline, tfidf_vectorizer
import requests#import re 
def analyze_text(text: str):
    doc = nlp(text)

    tokens = [token.text for token in doc]
    lemmas = [token.lemma_ for token in doc]
    pos_tags = [(token.text, token.pos_) for token in doc]
    dependencies = [(token.text, token.dep_, token.head.text) for token in doc]

    entities = [(ent.text, ent.label_) for ent in doc.ents]
    noun_chunks = [chunk.text for chunk in doc.noun_chunks]

    tfidf_vectorizer.fit([text])
    tfidf_features = tfidf_vectorizer.transform([text]).toarray().tolist()

    sentiment = sentiment_pipeline(text)[0]

    return {
        "tokens": tokens,
        "lemmas": lemmas,
        "pos_tags": pos_tags,
        "dependencies": dependencies,
        "tfidf_features": tfidf_features,
        "sentiment": sentiment,
        "syntax_analysis": {
            "entities": entities,
            "noun_chunks": noun_chunks
        },
        "knowledge_discovery": {
            "named_entities": entities,
            "noun_chunks": noun_chunks
        }
    }# Mapeamento simples de apelidos para códigos de moeda
MOEDAS_MAP = {
    "dólar": "USD", "dolar": "USD", "usd": "USD",
    "euro": "EUR", "eur": "EUR",
    "real": "BRL", "brl": "BRL",
    "iene": "JPY", "jpy": "JPY",
    "libra": "GBP", "gbp": "GBP",
    "BTC": "BTC", "bitcoin": "BTC",
    "ETH": "ETH", "ether": "ETH",
    "yuan": "CNY", "cny": "CNY",
    "Dogecoin": "DOGE", "dogecoin": "DOGE"
}

def identify_intent_and_entity(text: str):
    """
    Tenta descobrir se é uma intenção de cotação e qual a moeda.
    """
    text_lower = text.lower()
    intent = None
    entity = None

    # Lógica simples de Intenção (pode ser melhorada com Spacy Matcher depois)
    keywords_cotacao = ["cotação", "quanto tá", "valor do", "preço do", "quanto custa"]
    if any(k in text_lower for k in keywords_cotacao) or "moeda" in text_lower:
        intent = "consultar_cotacao"
        
        # Tenta extrair a moeda
        doc = nlp(text)
        
        # 1. Tenta achar via dicionário direto
        for token in doc:
            if token.text.lower() in MOEDAS_MAP:
                entity = MOEDAS_MAP[token.text.lower()]
                break
        
        # 2. Se não achou, tenta via Entidades do Spacy (MONEY ou ORG)
        if not entity:
            for ent in doc.ents:
                if ent.label_ == "ORG" or ent.label_ == "MONEY": 
                     # Ex: Se o Spacy pegar "USD" como ORG
                     if ent.text.lower() in MOEDAS_MAP:
                         entity = MOEDAS_MAP[ent.text.lower()]

    return intent, entity

# --- Sua função original modificada ---
def analyze_text(text: str):
    # ... (todo o seu código original de tokens, lemmas, etc permanece aqui) ...
    doc = nlp(text)
    # ... (código existente) ...
    
    # NOVAS LINHAS: Identificação de Intenção
    intent, entity_moeda = identify_intent_and_entity(text)

    return {
        # ... (seus campos originais: tokens, lemmas, etc) ...
        "intent_analysis": {
            "detected_intent": intent,
            "detected_entity": entity_moeda
        }
    }