"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

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
    currencyService.getById(params.id)
      .then(setFormData)
      .catch(() => setError(`Erro ao carregar moeda.`));
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
        id: params.id
        //histories: []
      });
      router.push("/currencies");
    } catch (error: any) {
      console.error("Erro ao atualizar moeda:", error);
      setError(`Erro ao atualizar moeda. ${error?.message || "Erro desconhecido"}`);
    }
  };


  return (
    <div className="min-h-screen bg-[#283976] text-white">
      <Header pageName="Editar Moeda" />

      <div className="space-y-6 max-w-4xl mx-auto mt-[100px] mb-[75px]">
        <form
          onSubmit={handleSubmit}
          className="bg-[#171e33] rounded-lg shadow-sm p-6 space-y-4"
        >
          <input
            name="symbol"
            className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="Símbolo"
          />
          <input
            name="name"
            className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome"
          />
          <input
            name="backing"
            className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white"
            value={formData.backing}
            onChange={handleChange}
            placeholder="Lastro"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="reverse"
              checked={formData.reverse}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm text-purple-200">Inverter Cotação (Reverse)</label>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end space-x-3 pt-2 mr-[10px] ">
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/currencies")} type="button">Cancelar</Button>
            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              type="submit">Atualizar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
