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

      // OCELOT - GATEWAY
      const res = await fetch("http://127.0.0.1:5000/api/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Erro ao conectar ao servidor");
      }

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
          C H A T B O T - COTAÇÃO DE MOEDAS
        </h1>

        {/* INPUT */}
        <textarea
          className="w-full h-[120px] bg-[#11172b] border border-[#fffcb7] rounded-lg p-3 text-white outline-none resize-none"
          placeholder="Digite sigla da moeda desejada para cotação."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* BOTÃO */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAnalyze}
            className="bg-[#FFD23F] text-black font-semibold hover:bg-yellow-400"
          >
            {loading ? "Consultando..." : "Consultar"}
          </Button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-6 text-[#FFD23F] font-semibold text-center">
            Buscando cotação...
          </div>
        )}

        {/* RESPOSTA FORMATADA */}
        {response && (
          <div className="mt-6 bg-[#020617] border border-[#fffcb7] rounded-lg p-4">

            {/* ERRO */}
            {"erro" in response && (
              <p className="text-red-400 font-bold text-center">
                {response.erro}
              </p>
            )}

            {/* MENSAGEM FORMATADA */}
            {"message" in response && (
              <p className="text-[#78ffef] text-lg font-semibold">
                {response.message}
              </p>
            )}

            {/* COTAÇÃO */}
            {response.intent === "cotacao" && (
              <p className="text-[#78ffef] text-lg font-semibold">
                O preço da moeda <span className="text-[#FFD23F]">{response.symbol}</span> é{" "}
                <span className="text-[#FFD23F]">
                  R$ {Number(response.price).toLocaleString("pt-BR")}
                </span>
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
