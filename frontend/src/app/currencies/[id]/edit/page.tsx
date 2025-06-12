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
    name: "",
    description: "",
    backing: "",
    status: "Ativo",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await currencyService.getById(Number(params.id));
        setFormData(data);
      } catch (err) {
        setError("Erro ao carregar moeda.");
      }
    }
    load();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await currencyService.update(Number(params.id), formData);
      router.push("/currencies");
    } catch (err) {
      setError("Erro ao atualizar moeda.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white">
      <Header pageName="Editar Moeda" />
      <div className="pt-[75px]  p-6 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Editar Moeda</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1e1e3f] border border-purple-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="text-sm text-purple-200">Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white mt-1"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-purple-200">Descrição</label>
            <input
              type="text"
              name="description"
              placeholder="Descrição"
              className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white mt-1"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-purple-200">Lastro</label>
            <input
              type="text"
              name="backing"
              placeholder="Lastro"
              className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white mt-1"
              value={formData.backing}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-purple-200">Status</label>
            <select
              name="status"
              className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white mt-1"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 font-semibold border border-red-500 rounded p-2 bg-red-900/20">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              className="border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform font-semibold rounded px-4 py-2"
              onClick={() => router.push("/currencies")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform font-semibold rounded px-4 py-2"
            >
              Atualizar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
