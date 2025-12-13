"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function ChatbotPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  //HISTÓRICO
  const [history, setHistory] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    //ADD MSG USER
    setHistory((prev) => [...prev, { from: "user", text }]);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/api/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      //ADD MSG BOT
      setHistory((prev) => [...prev, { from: "bot", data }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { from: "bot", data: { erro: "Falha ao conectar com o chatbot." } },
      ]);
    } finally {
      setLoading(false);
      setText("");
    }
  };

  const renderBotResponse = (response: any) => {
    if (!response) return null;

    if (response.erro) {
      return <p className="text-red-400 text-center font-bold">{response.erro}</p>;
    }

    if (response.message) {
      return (
        <p className="text-[#78ffef] text-lg font-semibold text-center">
          {response.message}
        </p>
      );
    }

    if (response.intent === "cotacao") {
      return (
        <div className="text-center">
          <p className="text-[#78ffef] text-lg font-semibold">
            O preço da moeda{" "}
            <span className="text-[#FFD23F]">{response.symbol}</span> é:
          </p>

          <p className="text-[#FFD23F] text-2xl font-bold mt-2">
            R$ {Number(response.price).toLocaleString("pt-BR")}
          </p>
        </div>
      );
    }

    if (response.intent === "saldo") {
      return (
        <div>
          <p className="text-[#78ffef] text-lg font-bold mb-3">Saldo da Carteira</p>

          <p className="text-yellow-300 text-xl font-bold">
            Total: R$ {response.saldo.toLocaleString("pt-BR")}
          </p>

          {response.moedas?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-1 text-[#FFD23F]">Detalhado:</p>

              {response.moedas.map((m: any, i: number) => (
                <p key={i} className="text-white">
                  {m.symbol}: {m.amount}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (response.intent === "deposito") {
      return (
        <div className="text-center">
          <p className="text-green-300 text-xl font-semibold">Depósito realizado!</p>

          <p className="mt-2">
            + {response.valor} {response.moeda}
          </p>

          <p className="mt-2 text-yellow-400 font-bold">
            Novo saldo: {response.novo_saldo}
          </p>
        </div>
      );
    }

    if (response.intent === "transferencia") {
      return (
        <div className="text-center">
          <p className="text-blue-300 text-xl font-semibold">
            Transferência concluída!
          </p>

          <p className="mt-2">
            {response.valor} {response.moeda}
          </p>

          <p className="text-[#FFD23F] font-semibold mt-2">
            Para: {response.destino}
          </p>

          <p className="text-green-300 mt-2 font-bold">
            Status: {response.status}
          </p>
        </div>
      );
    }

    return (
      <p className="text-white text-center">Resposta desconhecida da API.</p>
    );
  };

  return (
    <div className="min-h-[750px] bg-[#283976] text-white">
      <Header pageName="ChatBot" />

      <div className="max-w-4xl mx-auto mt-[55px] mb-10 p-6 bg-[#171e33] rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#fffcb7] mb-4">
          C H A T B O T - COTAÇÃO & CARTEIRA
        </h1>

        {/* TUTORIAL */}
        <div className="bg-[#11172b] border border-[#fffcb7] p-3 rounded-lg mb-5">
          <p className="text-[#fffcb7] font-bold mb-2">
            <br/>
            <p className="text-blue-300">Como usar o CHATBOT:</p>
            <p className="text-blue-300" >Este bot reconhece comandos de linguagem natural. Siga a ordem lógica abaixo para testar:</p>
            <br/>
            <p className="text-white">1. Identificação (Login): <p className="inline text-red-300">Meu nome é (SeuNomeDeUsuário)</p></p>
            <p className="text-white">2. Consultar Carteira: <p className="inline text-red-300">Qual é o meu Saldo?</p></p>
            <p className="text-white">3. Cotação de Moedas: <p className="inline text-red-300">Qual o valor do BTC?</p> ou apenas <p className="inline text-red-300">BTC</p></p>
            <p className="text-white">4. Depósito (Injeção de Fundos): <p className="inline text-red-300">Depositar 1000 USD para (NomeDeUsuário)</p></p>
            <p className="text-white">5. Transferência entre Usuários:
            (Logue como outro usuário antes, ex: "Meu nome é Admin")
            <p>6. Comando: <p className="inline text-red-300">Transferir 0.3 BTC para (NomeDeUsuário)</p></p></p>
            <br/>
          </p>
        </div>

        {/* HISTÓRICO DO CHAT */}
        <div className="bg-[#020617] border border-[#fffcb7] rounded-lg p-4 h-[350px] overflow-y-auto">
          {history.map((msg, index) => (
            <div key={index} className="mb-4 mt-4">
              {msg.from === "user" ? (
                <p className="text-yellow-300 font-bold">Você:</p>
              ) : (
                <p className="text-cyan-300 font-bold">ChatBot:</p>
              )}

              <div className="ml-3">
                {msg.from === "user" ? (
                  <p>{msg.text}</p>
                ) : (
                  renderBotResponse(msg.data)
                )}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-center text-[#FFD23F] mt-2">Processando...</p>
          )}
        </div>

        {/* INPUT */}
        <textarea
          className="w-full h-[120px] bg-[#11172b] border border-[#fffcb7] rounded-lg p-3 mt-4 text-white outline-none resize-none"
          placeholder="Digite seu comando aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* BOTÃO */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAnalyze}
            className="bg-[#FFD23F] text-black font-semibold hover:bg-yellow-400"
          >
            {loading ? "Consultando..." : "Enviar comando"}
          </Button>
        </div>
      </div>
    <div className="h-[30px] bg-[#283976]"></div>
    </div>
    
  );
}
