import spacy
from transformers import pipeline

# Carregamento único para eficiência
print("Carregando modelos de IA...")
try:
    nlp = spacy.load("en_core_web_sm")
except:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

sentiment_pipeline = pipeline("sentiment-analysis")
print("Modelos carregados.")
