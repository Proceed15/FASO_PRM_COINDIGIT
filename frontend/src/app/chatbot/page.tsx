"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function ChatbotPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const mockResponse = {
    tokens: ["bitcoin", "subiu", "hoje"],
    lemmas: ["bitcoin", "subir", "hoje"],
    pos_tags: [
      ["bitcoin", "NOUN"],
      ["subiu", "VERB"],
      ["hoje", "NOUN"]
    ],
    sentiment: {
      label: "POSITIVO",
      score: 0.95
    },
    entities: [
      ["Bitcoin", "MOEDA"]
    ],
    tf_idf: [
      { termo: "bitcoin", peso: 0.82 },
      { termo: "subiu", peso: 0.64 }
    ]
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      setResponse(mockResponse);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[800px] bg-[#0a1647] text-white">
      <Header pageName="ChatBot" />

      <div className="max-w-4xl mx-auto mt-10 mb-10 p-6 bg-[#171e33] rounded-xl shadow-xl">

        <h1 className="text-2xl font-bold text-[#fffcb7] mb-4">
          Analisador de Texto (IA)
        </h1>

        {/* INPUT */}
        <textarea
          className="w-full h-[120px] bg-[#11172b] border border-[#fffcb7] rounded-lg p-3 text-white outline-none resize-none"
          placeholder="Digite um texto para análise..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* BOTÃO */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAnalyze}
            className="bg-[#FFD23F] text-black font-semibold hover:bg-yellow-400"
          >
            {loading ? "Analisando..." : "Analisar"}
          </Button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-6 text-[#FFD23F] font-semibold text-center">
            Processando análise...
          </div>
        )}

        {/* RESPOSTA JSON */}
        {response && (
          <div className="mt-6">
            <h3 className="text-[#78ffef] font-bold mb-2">
              Resposta da IA (JSON)
            </h3>
            <pre className="bg-[#020617] border border-[#fffcb7] rounded-lg p-4 text-sm max-h-[300px] overflow-y-auto text-green-300">
{JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
