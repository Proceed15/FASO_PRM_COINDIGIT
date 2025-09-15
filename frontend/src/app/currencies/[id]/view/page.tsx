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
    <div className="min-h-screen bg-[#283976]">
      <Header pageName="Detalhes da Moeda" />
      <div className="space-y-6 max-w-4xl mx-auto mt-[100px] mb-[75px]">
        <div className="mb-3 bg-[#171e33] rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <p className="text-sm text-[#fffcb7]">Símbolo</p>
            <p className="text-lg font-medium text-white">{currency.symbol}</p>
          </div>
          <div>
            <p className="text-sm text-[#fffcb7]">Nome</p>
            <p className="text-lg font-medium text-white">{currency.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#fffcb7]">Lastro</p>
            <p className="text-lg font-medium text-white">{currency.backing}</p>
          </div>
          <div>
            <p className="text-sm text-[#fffcb7]">Reverse</p>
            <p className="text-lg font-medium text-white">{currency.reverse ? "Sim" : "Não"}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-2 mr-[15px]">
          <Button
            className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
            onClick={() => router.push(`/currencies/${currency.id}/edit`)}>Editar
          </Button>
          <Button
            className="w-[110px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
            onClick={() => router.push(`/currencies/${currency.id}/history`)}>
            Histórico
          </Button>
          <Button
            className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
            onClick={() => router.push("/currencies")}>Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
