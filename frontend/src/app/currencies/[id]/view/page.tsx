"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

interface CurrencyViewProps {
  params: {
    id: string;
  };
}

export default function CurrencyViewPage({ params }: CurrencyViewProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    currencyService.getById(params.id)
      .then(setCurrency)
      .catch(() => setError("Moeda não encontrada."));
  }, [params.id]);

  if (error) {
    return (
      <div className="pt-[100px] p-6 text-red-500">
        <Header pageName="Detalhes da Moeda" />
        {error}
      </div>
    );
  }

  if (!currency) {
    return (
      <div className="pt-[100px] p-6 text-white">
        <Header pageName="Detalhes da Moeda" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e]">
      <Header pageName="Detalhes da Moeda" />
      <div className="space-y-6 max-w-4xl mx-auto pt-[70px] pb-[75px]">
        <h1 className="text-2xl font-bold text-white">Vizualizar</h1>
        <div className="mb-3 bg-[#1e1e3f] border border-purple-200 rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <p className="text-sm text-purple-200">Símbolo</p>
            <p className="text-lg font-medium text-white">{currency.symbol}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200">Nome</p>
            <p className="text-lg font-medium text-white">{currency.name}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200">Lastro</p>
            <p className="text-lg font-medium text-white">{currency.backing}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200">Reverse</p>
            <p className="text-lg font-medium text-white">{currency.reverse ? "Sim" : "Não"}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            className="p-3 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
            onClick={() => router.push(`/currencies/${currency.id}/edit`)}>Editar
          </Button>
          <Button
            className="p-3 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
            onClick={() => router.push(`/currencies/${currency.id}/history`)}>
            Ver Histórico
          </Button>
          <Button
            className="p-3 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
            onClick={() => router.push("/currencies")}>Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
