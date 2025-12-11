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

      // OCELOT - gateway
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

        {/* RESPOSTA */}
        {response && (
          <div className="mt-6 bg-[#020617] border border-[#fffcb7] rounded-lg p-4">

            {/* ERRO */}
            {"erro" in response && (
              <p className="text-red-400 font-bold text-center">
                {response.erro}
              </p>
            )}

            {/* SE VEIO MOEDA */}
            {"moeda" in response && (
              <div>
                <h3 className="text-[#78ffef] text-xl font-bold mb-3">
                  Resultado da Consulta
                </h3>

                <p>
                  <span className="font-bold text-[#FFD23F]">Moeda: </span>
                  {response.moeda}
                </p>

                <p>
                  <span className="font-bold text-[#FFD23F]">Preço: </span>
                  R$ {response.preco.toLocaleString("pt-BR")}
                </p>

                {response.data && (
                  <p>
                    <span className="font-bold text-[#FFD23F]">Última atualização: </span>
                    {new Date(response.data).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            )}

            {/* DEBUG JSON */}
            <pre className="text-green-300 mt-4 text-xs opacity-60">
              {JSON.stringify(response, null, 2)}
            </pre>

          </div>
        )}

      </div>
    </div>
  );
}
