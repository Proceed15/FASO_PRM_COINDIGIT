import requests
import spacy
import re
from core.dictionary import is_moeda, get_nome_moeda

try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# --- CONFIGURAÇÕES ---
CURRENCY_API_URL = "http://localhost:5002/api/Currency"
WALLET_API_URL   = "http://localhost:5004/api/Wallet"
USER_API_URL     = "http://localhost:5120/api/User"

CURRENT_USER_ID = None 
CURRENT_USER_NAME = None

# ==============================================================================
# 1. FUNÇÕES AUXILIARES
# ==============================================================================

def buscar_usuario_por_nome(termo_busca):
    termo_busca = termo_busca.upper().strip()
    try:
        response = requests.get(USER_API_URL, timeout=5)
        if response.status_code != 200: return None
        lista = response.json()
        # 1. Match Exato
        for user in lista:
            if user.get("name", "").upper() == termo_busca: return user
        # 2. Match Parcial
        for user in lista:
            if termo_busca in user.get("name", "").upper(): return user
        return None
    except: return None

def get_wallet_id(user_id):
    """Retorna o ID da primeira carteira do usuário."""
    url = f"{WALLET_API_URL}/{user_id}"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            carteiras = resp.json()
            if carteiras: return carteiras[0].get("walletId")
        
        # Tenta criar se não existir
        requests.post(url, json={}, timeout=5)
        resp2 = requests.get(url, timeout=5)
        return resp2.json()[0].get("walletId") if resp2.json() else None
    except: return None

# ==============================================================================
# 2. AÇÕES DE NEGÓCIO
# ==============================================================================

def realizar_login(nome):
    global CURRENT_USER_ID, CURRENT_USER_NAME
    user = buscar_usuario_por_nome(nome)
    if user:
        CURRENT_USER_ID = user['id']
        CURRENT_USER_NAME = user['name']
        return {"intent": "login", "message": f"👋 Olá <strong>{CURRENT_USER_NAME}</strong>! (ID: {CURRENT_USER_ID})"}
    return {"erro": f"Usuário '{nome}' não encontrado."}

def deposito_simples(valor, simbolo, nome_destino):
    """INJEÇÃO DE VALORES (Cria dinheiro do nada)"""
    user = buscar_usuario_por_nome(nome_destino)
    if not user: return {"erro": f"Usuário '{nome_destino}' não encontrado."}
    
    wallet_id = get_wallet_id(user['id'])
    if not wallet_id: return {"erro": f"Erro na carteira de {user['name']}."}
    
    url = f"{WALLET_API_URL}/{user['id']}/{wallet_id}/items"
    payload = {"symbol": simbolo.upper(), "amount": float(valor)}
    
    try:
        r = requests.post(url, json=payload, timeout=5)
        if r.status_code in [200, 201]:
            return {"intent": "saldo", "message": f"✅ Depósito (Injeção) de <strong>{valor} {simbolo.upper()}</strong> realizado na conta de {user['name']}."}
        return {"erro": f"Erro API: {r.status_code}"}
    except Exception as e: return {"erro": str(e)}

def realizar_transferencia(valor, simbolo, nome_destino):
    """TRANSFERÊNCIA REAL (Tira de mim -> Manda para ele)"""
    if not CURRENT_USER_ID: return {"erro": "Identifique-se primeiro."}
    
    # 1. Dados do Destinatário
    user_dest = buscar_usuario_por_nome(nome_destino)
    if not user_dest: return {"erro": f"Destinatário '{nome_destino}' não encontrado."}
    
    # 2. Carteiras (Origem e Destino)
    wallet_origem = get_wallet_id(CURRENT_USER_ID)
    wallet_destino = get_wallet_id(user_dest['id'])
    
    if not wallet_origem: return {"erro": "Sua carteira não foi encontrada."}
    if not wallet_destino: return {"erro": f"Carteira de {user_dest['name']} não encontrada."}

    # 3. Executa Transferência
    url = f"{WALLET_API_URL}/transfer"
    payload = {
        "fromUserId": CURRENT_USER_ID,
        "toUserId": user_dest['id'],
        "fromWalletId": wallet_origem,
        "toWalletId": wallet_destino,
        "symbol": simbolo.upper(),
        "amount": float(valor)
    }
    
    print(f"DEBUG: Transferindo... {payload}")
    
    try:
        r = requests.post(url, json=payload, timeout=5)
        if r.status_code in [200, 201]:
            return {
                "intent": "saldo", 
                "message": f"💸 <strong>Transferência Realizada!</strong><br>Enviado: {valor} {simbolo.upper()}<br>Para: {user_dest['name']}"
            }
        elif r.status_code == 400:
            return {"erro": "Saldo insuficiente ou dados inválidos."}
        else:
            return {"erro": f"Erro na transferência: {r.text}"}
    except Exception as e: return {"erro": str(e)}

def consultar_saldo():
    if not CURRENT_USER_ID: return {"erro": "Diga: 'Eu sou o [Nome]'"}
    try:
        r = requests.get(f"{WALLET_API_URL}/{CURRENT_USER_ID}", timeout=5)
        if r.status_code == 200:
            cart = r.json()
            total_geral = 0
            itens_str = ""
            for c in cart:
                val_wallet = c.get("totalUsd") or 0
                soma_itens = 0
                for i in c.get("items") or []:
                    qtd = i.get("amount") or 0
                    sym = i.get("symbol") or "?"
                    # Ajuste para evitar erros matemáticos com floats
                    soma_itens += (i.get("totalUsd") or 0)
                    itens_str += f"<br>• {qtd} {sym}"
                
                if val_wallet == 0 and soma_itens > 0: total_geral += soma_itens
                else: total_geral += val_wallet

            return {"intent": "saldo", "message": f"Sr(a) {CURRENT_USER_NAME}, total: <strong>$ {total_geral:,.2f}</strong><br><br><strong>Ativos:</strong>{itens_str}"}
        return {"erro": "Carteira não encontrada."}
    except Exception as e: return {"erro": str(e)}

def buscar_cotacao(sigla):
    try:
        r = requests.get(CURRENCY_API_URL)
        item = next((i for i in r.json() if i.get("symbol") == sigla), None)
        if item and item.get("histories"):
            price = sorted(item["histories"], key=lambda x: x['date'], reverse=True)[0]['price']
            nome = get_nome_moeda(sigla)
            return {"intent": "cotacao", "symbol": sigla, "price": price, "message": f"O preço de <strong>{nome} ({sigla})</strong> é $ {price:,.4f}"}
        return {"erro": f"Moeda {sigla} não encontrada."}
    except: return {"erro": "Erro CurrencyAPI"}

# ==============================================================================
# 3. PROCESSADOR
# ==============================================================================

def processar_mensagem(texto):
    texto_upper = texto.upper()
    doc = nlp(texto_upper)

    # A. LOGIN
    match_nome = re.search(r"(?:MEU NOME [ÉE]|SOU [OA]|EU SOU [OA]?)\s+(.*)", texto_upper)
    if match_nome:
        return realizar_login(match_nome.group(1).strip(" .?!"))

    # B. TRANSFERIR / ENVIAR (Novo Fluxo)
    if "TRANSFERIR" in texto_upper or "ENVIAR" in texto_upper:
        match_val = re.search(r"\d+(\.\d+)?", texto)
        # Usa is_moeda para validar se é uma moeda real
        sigla = next((t.text for t in doc if is_moeda(t.text)), None) or \
                next((t.text for t in doc if 3 <= len(t.text) <= 5 and t.text.isalpha() and t.text not in ["PARA", "ENVIAR", "TRANSFERIR"]), None)

        if match_val and sigla and "PARA" in texto_upper:
            try:
                nome_dest = texto_upper.split("PARA")[1].strip(" .?!")
                return realizar_transferencia(match_val.group(), sigla, nome_dest)
            except: pass
        return {"erro": "Tente: 'Transferir 10 BTC para Maria'."}

    # C. DEPOSITAR (Injeção de fundos)
    if "DEPOSITAR" in texto_upper:
        match_val = re.search(r"\d+(\.\d+)?", texto)
        # Fallback de sigla (dicionário ou tamanho)
        sigla = next((t.text for t in doc if is_moeda(t.text)), None) or \
                next((t.text for t in doc if 3 <= len(t.text) <= 5 and t.text.isalpha() and t.text not in ["PARA", "DEPOSITAR", "QUERO"]), None)
        
        if match_val and sigla:
            valor = match_val.group()
            # Se for para terceiros
            if "PARA" in texto_upper:
                try:
                    nome_dest = texto_upper.split("PARA")[1].strip(" .?!")
                    return deposito_simples(valor, sigla, nome_dest)
                except: pass
            
            # Se for para o próprio
            if CURRENT_USER_ID:
                return deposito_simples(valor, sigla, CURRENT_USER_NAME)
            else:
                return {"erro": "Identifique-se primeiro."}
        
        return {"erro": "Use: 'Depositar 100 USD'."}

    # D. SALDO
    if any(k in texto_upper for k in ["SALDO", "CONTA", "CARTEIRA"]):
        return consultar_saldo()

    # E. COTAÇÃO
    sigla = next((t.text for t in doc if is_moeda(t.text)), None)
    if sigla: return buscar_cotacao(sigla)

    return {"erro": "Não entendi."}