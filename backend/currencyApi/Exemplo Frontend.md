// Exemplo Front-end
const response = await fetch('http://localhost:5002/api/CurrencyChart/top-currencies?top=5');
const data = await response.json();
// Esse data já vem pronto para jogar no Chart.js ou Recharts!