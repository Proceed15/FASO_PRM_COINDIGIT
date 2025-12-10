const form = document.getElementById('analyzeForm');
const output = document.getElementById('output');

form.onsubmit = async (e) => {
  e.preventDefault();
  const text = document.getElementById('textInput').value;

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
    output.textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    output.textContent = `Erro: ${error.message}`;
  }
};