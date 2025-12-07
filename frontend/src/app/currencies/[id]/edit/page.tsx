"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { CurrencyIconDetail } from "@/components/common/CurrencyIcon";

interface CurrencyEditProps {
  params: {
    id: string;
  };
}

export default function CurrencyEditPage({ params }: CurrencyEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Currency>({
    symbol: "",
    name: "",
    backing: "",
    reverse: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    currencyService
      .getById(params.id)
      .then(setFormData)
      .catch(() => setError("Erro ao carregar moeda."));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await currencyService.update(params.id, {
        ...formData,
        id: params.id,
      });
      router.push(`/currencies/${params.id}/view`);
      //router.push(`/currencies/${params.id}`); N ACREDITO QUE ERA ISSO
    } catch (error: any) {
      console.error("Erro ao atualizar moeda:", error);
      setError(
        `Erro ao atualizar moeda. ${
          error?.message || "Erro desconhecido"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#283976] text-white">
      <Header pageName="Editar Moeda" />
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="mt-[60px] mb-[60px] bg-[#171e33] rounded-lg shadow-md p-10 w-[1000px] text-center space-y-6"
        >
          {/* Ícone e símbolo */}
          <div className="flex flex-col items-center space-y-2">
            <CurrencyIconDetail symbol={formData.symbol} className="w-16 h-16" />
          </div>

          {/* Inputs */}
          <div className="space-y-4 text-left">
            <div>
              <p className="text-sm text-[#fffcb7]">Símbolo</p>
              <input
                name="symbol"
                className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-[#fffcb7] focus:border-[#fffcb7]"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="Símbolo"
              />
            </div>
            <div>
              <p className="text-sm text-[#fffcb7]">Nome</p>
              <input
                name="name"
                className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-[#fffcb7] focus:border-[#fffcb7]"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome"
              />
            </div>
            <div>
              <p className="text-sm text-[#fffcb7]">Lastro</p>
              <input
                name="backing"
                className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-[#fffcb7] focus:border-[#fffcb7]"
                value={formData.backing}
                onChange={handleChange}
                placeholder="Lastro"
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="reverse"
                checked={formData.reverse}
                onChange={handleChange}
                className="h-4 w-4 accent-[#fffcb7]"
              />
              <label className="text-sm text-[#fffcb7]">Reverse</label>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Botões */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push(`/currencies/${params.id}/view`)}
              type="button"
            >
              Voltar
            </Button>
            <Button
              className="w-[110px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/currencies")}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
