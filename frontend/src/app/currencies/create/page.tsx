"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function CreateCurrencyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Currency>({
    name: "",
    description: "",
    backing: "",
    status: "Ativo",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await currencyService.create(formData);
      router.push("/currencies");
    } catch (err) {
      setError("Erro ao cadastrar moeda.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white pt-[100px]">
      <Header pageName="Nova Moeda" />
      <div className="max-w-3xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-[#1e1e3f] p-6 rounded-lg border border-purple-500"
        >
          <h2 className="text-xl font-bold">Cadastrar nova moeda</h2>

          <input
            type="text"
            name="name"
            placeholder="Nome"
            className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Descrição"
            className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="backing"
            placeholder="Lastro"
            className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400"
            value={formData.backing}
            onChange={handleChange}
          />
          <select
            name="status"
            className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>

          {error && <div className="text-red-500">{error}</div>}

          <div className="flex justify-between">
            <Button
              type="button"
              className="border border-purple-300 bg-transparent text-white hover:bg-purple-800"
              onClick={() => router.push("/currencies")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-[#52008b]"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
