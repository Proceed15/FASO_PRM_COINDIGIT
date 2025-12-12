import requests
import spacy
import re # Usaremos Regex para extrair valores numéricos ("100", "50.5")

# Carrega o Spacy
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# --- CONFIGURAÇÕES ---
CURRENCY_API_URL = "http://localhost:5002/api/Currency"
WALLET_API_URL   = "http://localhost:5004/api/Wallet"

# ID fixo do usuário para o MVP (Baseado no seu JSON)
MOCK_USER_ID = 63 

# --- 1. CONSULTAR SALDO (Atualizado para Lista) ---
def consultar_saldo_usuario():
    url = f"{WALLET_API_URL}/{MOCK_USER_ID}"
    print(f"DEBUG: Consultando saldo em {url}")
    
    try:
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            carteiras = response.json() # Agora sabemos que é uma LISTA
            
            if not carteiras:
                return {"message": "Você não possui carteiras cadastradas.", "intent": "saldo"}

            total_geral = 0
            detalhes = ""

            # Soma o total de todas as carteiras encontradas
            for wallet in carteiras:
                total_usd = wallet.get("totalUsd", 0)
                total_geral += total_usd
                
                # Opcional: Listar itens se quiser detalhar
                items = wallet.get("items", [])
                if items:
                    for item in items:
                        detalhes += f"<br>- {item['amount']} {item['symbol']}"

            # Formata resposta
            msg = f"Seu patrimônio total é de <strong>$ {total_geral:,.2f}</strong>."
            if detalhes:
                msg += f"<br><br><strong>Seus Ativos:</strong>{detalhes}"
                
            return {
                "intent": "saldo",
                "message": msg
            }
        
        elif response.status_code == 404:
            return {"erro": "Usuário não encontrado na WalletAPI."}
        else:
            return {"erro": f"Erro na WalletAPI: {response.status_code}"}
            
    except Exception as e:
        return {"erro": f"A WalletAPI parece estar offline. Detalhe: {str(e)}"}

# --- 2. REALIZAR DEPÓSITO (Nova Função) ---
def realizar_deposito(valor, simbolo):
    # Passo A: Precisamos do walletId do usuário para depositar
    # Vamos buscar as carteiras e pegar a primeira disponível
    url_get = f"{WALLET_API_URL}/{MOCK_USER_ID}"
    
    try:
        resp_wallet = requests.get(url_get, timeout=5)
        if resp_wallet.status_code != 200:
            return {"erro": "Não consegui acessar sua carteira para depositar."}
        
        carteiras = resp_wallet.json()
        if not carteiras:
            return {"erro": "Você não tem carteira ativa para receber depósitos."}
            
        # Pega o ID da primeira carteira da lista
        primeira_wallet = carteiras[0]
        wallet_id = primeira_wallet.get("walletId")
        
        # Passo B: Fazer o POST do depósito
        # Rota: /api/Wallet/{userId}/{walletId}/items
        url_post = f"{WALLET_API_URL}/{MOCK_USER_ID}/{wallet_id}/items"
        
        payload = {
            "symbol": simbolo.upper(),
            "amount": float(valor)
        }
        
        print(f"DEBUG: Depositando {payload} em {url_post}")
        
        resp_post = requests.post(url_post, json=payload, timeout=5)
        
        if resp_post.status_code in [200, 201]:
            return {
                "intent": "saldo", # Usa o estilo visual de saldo (azul)
                "message": f"✅ Sucesso! Depósito de <strong>{valor} {simbolo}</strong> realizado."
            }
        else:
            return {"erro": f"Falha no depósito. API retornou: {resp_post.status_code}"}

    except Exception as e:
        return {"erro": f"Erro ao processar depósito: {str(e)}"}

# --- 3. CONSULTAR COTAÇÃO (Mantida) ---
def buscar_cotacao_moeda(sigla):
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
    
    # 1. INTENÇÃO: DEPÓSITO (Ex: "Depositar 100 BTC")
    if "DEPOSITAR" in texto_upper or "DEPOSITO" in texto_upper:
        # Regex para achar número (inteiro ou decimal)
        match_valor = re.search(r"\d+(\.\d+)?", texto_usuario)
        
        # Procura sigla (3 a 5 letras maiúsculas)
        doc = nlp(texto_upper)
        sigla = None
        for token in doc:
            if 3 <= len(token.text) <= 5 and token.text not in ["DEPOSITAR", "QUERO", "PARA"]:
                sigla = token.text
                
        if match_valor and sigla:
            valor = match_valor.group()
            return realizar_deposito(valor, sigla)
        else:
            return {"erro": "Para depositar, diga o valor e a moeda. Ex: 'Depositar 100 BTC'."}

    # 2. INTENÇÃO: SALDO
    if any(p in texto_upper for p in ["SALDO", "CARTEIRA", "CONTA", "DINHEIRO"]):
        return consultar_saldo_usuario()

    # 3. INTENÇÃO: COTAÇÃO
    # (Reutiliza a lógica de buscar sigla isolada se não for depósito)
    doc = nlp(texto_upper)
    sigla_cotacao = None
    for token in doc:
        if token.text in ["QUAL", "VALOR", "PRECO", "PRICE"]: continue
        if 3 <= len(token.text) <= 5 and token.text.isalpha():
            sigla_cotacao = token.text
            break
            
    if sigla_cotacao:
        return buscar_cotacao_moeda(sigla_cotacao)

    return {"erro": "Comando não reconhecido."}