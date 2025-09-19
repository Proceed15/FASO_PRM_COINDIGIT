"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function CreateCurrencyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Currency>({
    symbol: "",
    name: "",
    backing: "",
    reverse: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await currencyService.create(formData);
      router.push("/currencies");
    } catch {
      setError("Erro ao cadastrar moeda.");
    }
  };

  return (
    <div className="min-h-screen bg-[#283976] text-white">
      <Header pageName="Nova Moeda" />
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="mt-[20px] mb-[20px] bg-[#171e33] border border-purple-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="text-sm text-[#fffcb7]">Símbolo</label>
            <input
              name="symbol"
              className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white mt-1"
              value={formData.symbol}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm text-[#fffcb7]">Nome</label>
            <input
              name="name"
              className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white mt-1"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm text-[#fffcb7]">Lastro</label>
            <input
              name="backing"
              className="w-full bg-transparent border border-[#fffcb7] rounded px-4 py-2 text-white mt-1"
              value={formData.backing}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="reverse"
              checked={formData.reverse}
              onChange={handleChange}
              className="h-4 w-4 accent-[#fffcb7]"
            />
            <label className="text-sm text-[#fffcb7]">Inverter Cotação (Reverse)</label>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="mr-[10px] mb-[10px] flex justify-end space-x-4 mt-8">
            <Button
              variant="outline"
              className="text-white w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/currencies")}
              type="button"
            >
              Cancelar
            </Button>

            <Button
              className="w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              type="submit"
            >
              Cadastrar
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}
