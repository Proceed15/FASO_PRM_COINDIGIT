from core.models import nlp, sentiment_pipeline, tfidf_vectorizer

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
    }