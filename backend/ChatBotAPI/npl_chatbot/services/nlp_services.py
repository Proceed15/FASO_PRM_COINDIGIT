import requests
import spacy
import re

# Carrega o Spacy
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# --- CONFIGURAÇÕES DE API ---
CURRENCY_API_URL = "http://localhost:5002/api/Currency"
WALLET_API_URL   = "http://localhost:5004/api/Wallet"
USER_API_URL     = "http://localhost:5120/api/User"

# --- ESTADO DA SESSÃO ---
# Inicialmente ninguém está logado (None)
# Nota: Em produção real, isso seria gerenciado por token/sessão por usuário, 
# mas para teste local funciona bem usar uma global.
CURRENT_USER_ID = None 
CURRENT_USER_NAME = None

# --- 1. BUSCAR USUÁRIO NA API (Nova Função) ---
def autenticar_usuario(nome_falado):
    global CURRENT_USER_ID, CURRENT_USER_NAME
    
    print(f"DEBUG: Buscando usuário com nome parecido com '{nome_falado}'...")
    
    try:
        # Busca todos os usuários (GET /api/User)
        response = requests.get(USER_API_URL, timeout=5)
        
        if response.status_code != 200:
            return {"erro": "Não consegui conectar na UserAPI para verificar seu nome."}
        
        lista_usuarios = response.json()
        
        # Procura alguém com o nome citado (busca insensível a maiúsculas/minúsculas)
        usuario_encontrado = None
        for user in lista_usuarios:
            # Verifica se o nome falado está DENTRO do nome do usuário (ex: "André" em "André Souza")
            nome_db = user.get("name", "").upper()
            if nome_falado.upper() in nome_db:
                usuario_encontrado = user
                break
        
        if usuario_encontrado:
            CURRENT_USER_ID = usuario_encontrado.get("id")
            CURRENT_USER_NAME = usuario_encontrado.get("name")
            return {
                "intent": "login",
                "message": f"Olá <strong>{CURRENT_USER_NAME}</strong>! Encontrei seu cadastro (ID: {CURRENT_USER_ID}).<br>Agora posso acessar sua carteira."
            }
        else:
            return {"erro": f"Não encontrei nenhum usuário chamado '{nome_falado}' no sistema."}

    except Exception as e:
        return {"erro": f"Erro ao conectar na UserAPI: {str(e)}"}

# --- 2. CONSULTAR SALDO (Atualizado para usar ID dinâmico) ---
def consultar_saldo_usuario():
    # Verifica se já sabemos quem é o usuário
    if CURRENT_USER_ID is None:
        return {"erro": "Eu ainda não sei quem é você. Por favor, diga: <strong>'Meu nome é [Seu Nome]'</strong>."}

    url = f"{WALLET_API_URL}/{CURRENT_USER_ID}"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            carteiras = response.json()
            if not carteiras:
                return {"message": "Sua conta existe, mas não possui carteiras.", "intent": "saldo"}

            total_geral = 0
            detalhes = ""
            for wallet in carteiras:
                total_geral += wallet.get("totalUsd", 0)
                items = wallet.get("items", [])
                if items:
                    for item in items:
                        detalhes += f"<br>- {item['amount']} {item['symbol']}"

            msg = f"Sr(a) {CURRENT_USER_NAME}, seu patrimônio é <strong>$ {total_geral:,.2f}</strong>."
            if detalhes:
                msg += f"<br><br><strong>Ativos:</strong>{detalhes}"
            return {"intent": "saldo", "message": msg}
        
        elif response.status_code == 404:
            return {"erro": "Carteira não encontrada."}
        else:
            return {"erro": f"Erro na API: {response.status_code}"}
    except Exception as e:
        return {"erro": str(e)}

# --- 3. DEPÓSITO (Atualizado para usar ID dinâmico) ---
def realizar_deposito(valor, simbolo):
    if CURRENT_USER_ID is None:
        return {"erro": "Identifique-se primeiro dizendo 'Meu nome é...'"}

    # (Lógica idêntica à anterior, mas usando CURRENT_USER_ID)
    try:
        # Pega carteira
        resp_wallet = requests.get(f"{WALLET_API_URL}/{CURRENT_USER_ID}")
        carteiras = resp_wallet.json()
        if not carteiras: return {"erro": "Sem carteira ativa."}
        
        wallet_id = carteiras[0].get("walletId")
        
        # Faz depósito
        url_post = f"{WALLET_API_URL}/{CURRENT_USER_ID}/{wallet_id}/items"
        payload = {"symbol": simbolo.upper(), "amount": float(valor)}
        
        requests.post(url_post, json=payload)
        
        return {
            "intent": "saldo",
            "message": f"✅ Depósito de {valor} {simbolo} realizado para {CURRENT_USER_NAME}."
        }
    except Exception as e:
        return {"erro": str(e)}

# --- 4. BUSCAR COTAÇÃO (Sem alterações) ---
def buscar_cotacao_moeda(sigla):
    # (Mantém o código que já fizemos de CurrencyAPI)
    # ... Coloque aqui a função buscar_cotacao_moeda que já estava pronta ...
    try:
        response = requests.get(CURRENCY_API_URL, timeout=5)
        if response.status_code != 200: return {"erro": "Erro na CurrencyAPI"}
        
        lista = response.json()
        # Procura moeda
        item = next((i for i in lista if i.get("symbol") == sigla), None)
        
        if item:
            historicos = item.get("histories", [])
            if not historicos: return {"erro": f"Sem histórico para {sigla}."}
            
            # Ordena por data
            ultimo = sorted(historicos, key=lambda x: x['date'], reverse=True)[0]
            return {"symbol": sigla, "price": ultimo.get("price")}
        else:
            return {"erro": f"Moeda '{sigla}' não encontrada."}
    except Exception as e:
        return {"erro": f"Erro Currency: {str(e)}"}

# --- PROCESSADOR PRINCIPAL ---
def processar_mensagem(texto_usuario):
    texto_upper = texto_usuario.upper()

    # A. INTENÇÃO: IDENTIFICAÇÃO (Novo!)
    # Frases: "Meu nome é André", "Eu sou o André", "Sou André"
    if "MEU NOME" in texto_upper or "SOU O" in texto_upper or "SOU A" in texto_upper:
        # Tenta pegar o nome. Remove as palavras chave e pega o resto
        nome_limpo = texto_usuario.upper().replace("MEU NOME É", "").replace("MEU NOME E", "").replace("EU SOU O", "").replace("SOU O", "").strip()
        # Remove pontuação final
        nome_limpo = nome_limpo.replace(".", "")
        
        if len(nome_limpo) > 1:
            return autenticar_usuario(nome_limpo)
        else:
            return {"erro": "Não entendi seu nome. Tente: 'Meu nome é [Nome]'."}

    # B. INTENÇÃO: SALDO
    if any(p in texto_upper for p in ["SALDO", "CARTEIRA", "CONTA"]):
        return consultar_saldo_usuario()

    # C. INTENÇÃO: DEPÓSITO
    if "DEPOSITAR" in texto_upper:
        match_valor = re.search(r"\d+(\.\d+)?", texto_usuario)
        doc = nlp(texto_upper)
        sigla = None
        for token in doc:
            if 3 <= len(token.text) <= 5 and token.text not in ["DEPOSITAR", "QUERO"]:
                sigla = token.text
        
        if match_valor and sigla:
            return realizar_deposito(match_valor.group(), sigla)
        return {"erro": "Diga o valor e a moeda. Ex: 'Depositar 100 USD'."}

    # D. INTENÇÃO: COTAÇÃO
    doc = nlp(texto_upper)
    sigla_cotacao = None
    for token in doc:
        if token.text in ["QUAL", "VALOR", "PRECO", "PRICE", "MEU", "NOME", "SOU"]: continue
        if 3 <= len(token.text) <= 5 and token.text.isalpha():
            sigla_cotacao = token.text
            break
            
    if sigla_cotacao:
        return buscar_cotacao_moeda(sigla_cotacao)

    return {"erro": "Não entendi. Se apresente dizendo 'Meu nome é...'. e tente novamente"}