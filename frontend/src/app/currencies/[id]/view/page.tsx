"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { CurrencyIconDetail } from "@/components/common/CurrencyIcon";

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
    currencyService
      .getById(params.id)
      .then(setCurrency)
      .catch(() => setError("Moeda não encontrada."));
  }, [params.id]);

  if (error) {
    return (
      <div className="pt-[100px] p-6 text-red-500">
        <Header pageName="Editar Moeda" />
        {error}
      </div>
    );
  }

  if (!currency) {
    return (
      <div className="pt-[100px] p-6 text-white">
        <Header pageName="Editar Moeda" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#283976]">
      <Header pageName="Dados da Moeda" />
      <div className="flex justify-center items-center">
        <div className="mt-[60px] mb-[60px] bg-[#171e33] rounded-lg shadow-md p-10 w-[1000px] text-center">
          {/* Ícone e símbolo */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <CurrencyIconDetail symbol={currency.symbol} className="w-16 h-16" />
          </div>

          {/* Informações */}
          <div className="space-y-4 text-left text-white">
            <div>
              <p className="text-sm text-[#fffcb7]">Nome</p>
              <p className="text-base font-medium">{currency.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#fffcb7]">Lastro</p>
              <p className="text-base font-medium">{currency.backing}</p>
            </div>
            <div>
              <p className="text-sm text-[#fffcb7]">Reverse</p>
              <p className="text-base font-medium">
                {currency.reverse ? "Sim" : "Não"}
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 mt-10">
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/currencies")}
            >
              Voltar
            </Button>
            <Button
              className="w-[110px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push(`/currencies/${currency.id}/history`)}
            >
              Histórico
            </Button>
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push(`/currencies/${currency.id}/edit`)}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
