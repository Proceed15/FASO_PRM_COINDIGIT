import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import pipeline

nlp = spacy.load("en_core_web_sm")
sentiment_pipeline = pipeline("sentiment-analysis")
tfidf_vectorizer = TfidfVectorizer()