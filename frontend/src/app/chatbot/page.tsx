"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function ChatbotPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setResponse(null);

      const res = await fetch("http://127.0.0.1:5000/api/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Erro ao conectar ao servidor");

      const data = await res.json();
      setResponse(data);

    } catch (error) {
      console.error("Erro:", error);
      setResponse({ erro: "Falha ao conectar com o chatbot." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[750px] bg-[#283976] text-white">
      <Header pageName="ChatBot" />

      <div className="max-w-4xl mx-auto mt-[55px] mb-10 p-6 bg-[#171e33] rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#fffcb7] mb-4">
          C H A T B O T - COTAÇÃO & CARTEIRA
        </h1>

        {/* INPUT */}
        <textarea
          className="w-full h-[120px] bg-[#11172b] border border-[#fffcb7] rounded-lg p-3 text-white outline-none resize-none"
          placeholder="Exemplos:
- USD
- Saldo
- Depositar 100 USD
- Transferir 10 EUR para Maria"
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

        {/* LOADING */}
        {loading && (
          <div className="mt-6 text-[#FFD23F] font-semibold text-center">
            Processando...
          </div>
        )}

        {/* RESPOSTA */}
        {response && (
          <div className="mt-6 bg-[#020617] border border-[#fffcb7] rounded-lg p-4">
            
            {/* ERRO */}
            {"erro" in response && (
              <p className="text-red-400 font-bold text-center">
                {response.erro}
              </p>
            )}

            {/* MENSAGEM PADRÃO */}
            {"message" in response && (
              <p className="text-[#78ffef] text-lg font-semibold text-center">
                {response.message}
              </p>
            )}

            {/* --------------------------- */}
            {/* COTAÇÃO */}
            {/* --------------------------- */}
            {response.intent === "cotacao" && (
              <div className="text-center">
                <p className="text-[#78ffef] text-lg font-semibold">
                  O preço da moeda{" "}
                  <span className="text-[#FFD23F]">{response.symbol}</span> é:
                </p>

                <p className="text-[#FFD23F] text-2xl font-bold mt-2">
                  R$ {Number(response.price).toLocaleString("pt-BR")}
                </p>
              </div>
            )}

            {/* --------------------------- */}
            {/* SALDO */}
            {/* --------------------------- */}
            {response.intent === "saldo" && (
              <div>
                <p className="text-[#78ffef] text-lg font-bold mb-3">
                  Saldo da Carteira
                </p>

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
            )}

            {/* --------------------------- */}
            {/* DEPÓSITO */}
            {/* --------------------------- */}
            {response.intent === "deposito" && (
              <div className="text-center">
                <p className="text-green-300 text-xl font-semibold">
                  Depósito realizado!
                </p>

                <p className="mt-2">
                  + {response.valor} {response.moeda}
                </p>

                <p className="mt-2 text-yellow-400 font-bold">
                  Novo saldo: {response.novo_saldo}
                </p>
              </div>
            )}

            {/* --------------------------- */}
            {/* TRANSFERÊNCIA */}
            {/* --------------------------- */}
            {response.intent === "transferencia" && (
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
            )}

          </div>
        )}
      </div>
    </div>
  );
}
