import requests
import spacy
import re

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

def garantir_carteira_usuario(user_id):
    url = f"{WALLET_API_URL}/{user_id}"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200 and resp.json():
            return resp.json()[0].get("walletId")
        
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

def deposito_para_usuario(valor, simbolo, nome_destino):
    user = buscar_usuario_por_nome(nome_destino)
    if not user: return {"erro": f"Usuário '{nome_destino}' não encontrado."}
    
    wallet_id = garantir_carteira_usuario(user['id'])
    if not wallet_id: return {"erro": f"Erro na carteira de {user['name']}."}
    
    url = f"{WALLET_API_URL}/{user['id']}/{wallet_id}/items"
    # Força símbolo em maiúsculo
    payload = {"symbol": simbolo.upper(), "amount": float(valor)}
    
    try:
        r = requests.post(url, json=payload, timeout=5)
        if r.status_code in [200, 201]:
            return {"intent": "saldo", "message": f"✅ Depositei <strong>{valor} {simbolo.upper()}</strong> para {user['name']}."}
        return {"erro": f"Erro API: {r.status_code}"}
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
                # CORREÇÃO DO TOTAL: Se a carteira vier zerada, soma os itens manualmente
                val_wallet = c.get("totalUsd") or 0
                
                soma_itens = 0
                items = c.get("items") or []
                
                for i in items:
                    qtd = i.get("amount") or 0
                    sym = i.get("symbol") or "?"
                    val_item = i.get("totalUsd") or 0 # Pega o valor calculado do item se existir
                    soma_itens += val_item
                    
                    itens_str += f"<br>• {qtd} {sym}"
                
                # Se o total da wallet for 0 mas a soma dos itens for maior, usa a soma dos itens
                if val_wallet == 0 and soma_itens > 0:
                    total_geral += soma_itens
                else:
                    total_geral += val_wallet

            return {"intent": "saldo", "message": f"Sr(a) {CURRENT_USER_NAME}, total: <strong>$ {total_geral:,.2f}</strong><br><br><strong>Ativos:</strong>{itens_str}"}
        return {"erro": "Carteira não encontrada."}
    except Exception as e: return {"erro": str(e)}

def buscar_cotacao(sigla):
    try:
        r = requests.get(CURRENCY_API_URL)
        # Filtra para achar a moeda
        item = next((i for i in r.json() if i.get("symbol") == sigla), None)
        if item and item.get("histories"):
            price = sorted(item["histories"], key=lambda x: x['date'], reverse=True)[0]['price']
            return {"symbol": sigla, "price": price}
        return {"erro": f"Moeda {sigla} não encontrada."}
    except: return {"erro": "Erro CurrencyAPI"}

# ==============================================================================
# 3. PROCESSADOR (CORRIGIDO COM .isalpha())
# ==============================================================================

def processar_mensagem(texto):
    texto_upper = texto.upper()
    doc = nlp(texto_upper)

    # LOGIN
    match_nome = re.search(r"(?:MEU NOME [ÉE]|SOU [OA]|EU SOU [OA]?)\s+(.*)", texto_upper)
    if match_nome:
        return realizar_login(match_nome.group(1).strip(" .?!"))

    # DEPÓSITO
    if "DEPOSITAR" in texto_upper:
        match_val = re.search(r"\d+(\.\d+)?", texto)
        
        # --- CORREÇÃO AQUI: t.text.isalpha() ---
        # Garante que só pega letras (BTC, USD) e ignora números (200, 100)
        sigla = next((t.text for t in doc if 3 <= len(t.text) <= 5 and t.text.isalpha() and t.text not in ["PARA", "DEPOSITAR", "QUERO"]), None)
        
        if match_val and sigla:
            valor = match_val.group()
            # Verifica destinatário
            if "PARA" in texto_upper:
                try:
                    nome_dest = texto_upper.split("PARA")[1].strip(" .?!")
                    if nome_dest: return deposito_para_usuario(valor, sigla, nome_dest)
                except: pass
            
            # Depósito próprio
            if CURRENT_USER_ID:
                return deposito_para_usuario(valor, sigla, CURRENT_USER_NAME)
            else:
                return {"erro": "Identifique-se primeiro."}
        
        return {"erro": "Use: 'Depositar 100 USD'."}

    # SALDO
    if any(k in texto_upper for k in ["SALDO", "CONTA", "CARTEIRA"]):
        return consultar_saldo()

    # COTAÇÃO
    sigla = next((t.text for t in doc if 3 <= len(t.text) <= 5 and t.text.isalpha() and t.text not in ["VALOR", "PRICE"]), None)
    if sigla: return buscar_cotacao(sigla)

    return {"erro": "Não entendi."}
