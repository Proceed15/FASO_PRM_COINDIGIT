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
    async function load() {
      try {
        const data = await currencyService.getById(Number(params.id));
        setCurrency(data);
      } catch (err) {
        setError("Moeda não encontrada.");
      }
    }
    load();
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
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] pt-[100px] text-white">
      <Header pageName="Detalhes da Moeda" />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#1e1e3f] p-6 rounded border border-purple-500 space-y-4">
          <h1 className="text-2xl font-bold">{currency.name}</h1>
          <p><strong>Descrição:</strong> {currency.description}</p>
          <p><strong>Lastro:</strong> {currency.backing}</p>
          <p><strong>Status:</strong> {currency.status}</p>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={() => router.push(`/currencies/${currency.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            className="bg-purple-700 hover:bg-purple-800"
            onClick={() => router.push("/currencies")}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
