import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import pipeline
from pydantic import BaseModel, Field, AliasChoices
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import List

nlp = spacy.load("en_core_web_sm")
sentiment_pipeline = pipeline("sentiment-analysis")
tfidf_vectorizer = TfidfVectorizer()

# --- Mapeamento da classe C#: Currency ---
class Currency(BaseModel):
    # Usamos 'alias' para aceitar tanto "Symbol" (C# PascalCase) quanto "symbol" (JSON padrão web)
    symbol: str = Field(validation_alias=AliasChoices('Symbol', 'symbol'))
    name: str = Field(validation_alias=AliasChoices('Name', 'name'))
    backing: str = Field(validation_alias=AliasChoices('Backing', 'backing'))

# --- Mapeamento da classe C#: History ---
class History(BaseModel):
    currency_id: UUID = Field(validation_alias=AliasChoices('CurrencyId', 'currencyId'))
    price: Decimal = Field(validation_alias=AliasChoices('Price', 'price'))
    date: datetime = Field(validation_alias=AliasChoices('Date', 'date'))

# Modelo para caso a API retorne uma lista combinada ou um objeto complexo
class DadosMoeda(BaseModel):
    moeda: Currency
    historico: List[History]