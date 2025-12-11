const form = document.getElementById('analyzeForm');
const output = document.getElementById('output');

form.onsubmit = async (e) => {
  e.preventDefault();
  const text = document.getElementById('textInput').value;

  // Feedback de carregamento (resetando estilos anteriores)
  output.textContent = "Consultando mercado...";
  output.style.color = "black";

  try {
    const response = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Erro ao processar a solicitação.");
    }

    const result = await response.json();

    // --- LÓGICA DE FORMATAÇÃO VISUAL ---
    
    // 1. Caso de Erro (ex: moeda não encontrada)
    if (result.erro) {
       output.textContent = result.erro;
       output.style.color = "red";
    } 
    // 2. Caso de Sucesso (exibição bonita do preço)
    else if (result.price) {
       output.style.color = "green";
       // Usamos innerHTML para permitir negrito (<strong>) e quebra de linha (<br>)
       output.innerHTML = `
          <div style="font-size: 1.2em;">
             <strong>Moeda:</strong> ${result.symbol}<br>
             <strong>Preço:</strong> $ ${parseFloat(result.price).toFixed(4)}
          </div>
       `;
    } 
    // 3. Fallback (mostra JSON cru se não for nenhum dos anteriores)
    else {
       output.textContent = JSON.stringify(result, null, 2);
       output.style.color = "black";
    }

  } catch (error) {
    output.textContent = `Erro crítico: ${error.message}`;
    output.style.color = "red";
  }
};