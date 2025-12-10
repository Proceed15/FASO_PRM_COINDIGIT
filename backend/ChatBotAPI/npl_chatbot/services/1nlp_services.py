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
def processar_mensagem(texto_usuario):
    # 1. Gera a análise linguística (o JSON que você me mostrou)
    analise_nlp = analyze_text(texto_usuario)
    
    # 2. Procura por oportunidades de chamar o C#
    dados_financeiros = None
    
    # Acessa: knowledge_discovery -> named_entities
    entidades = analise_nlp.get("knowledge_discovery", {}).get("named_entities", [])
    
    # Percorre as entidades encontradas (ex: [["BTC", "ORG"]])
    for entidade in entidades:
        termo = entidade[0] # Pega o "BTC"
        tipo = entidade[1]  # Pega o "ORG"
        
        # Filtro de segurança: Só chama o C# se a sigla tiver 3 a 5 letras
        # Isso evita chamar a API para entidades como "Microsoft" ou nomes de pessoas
        if len(termo) <= 5 and termo.isupper():
            print(f"Detectei possível moeda: {termo}. Chamando API C#...")
            
            # Chama a função que criamos anteriormente
            dados_financeiros = buscar_no_csharp(termo)
            
            # Se achou algo válido, para de procurar e retorna
            if "erro" not in dados_financeiros:
                break
    
    # 3. Injeta o resultado do C# no JSON final
    analise_nlp["financial_data"] = dados_financeiros
    
    return analise_nlp