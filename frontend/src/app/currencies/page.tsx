"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";

export default function CurrencyListPage() {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const data = await currencyService.getAll();
        setCurrencies(data);
      } catch (err) {
        setError("Erro ao carregar moedas");
      }
    }
    fetchCurrencies();
  }, []);

  const filtered = currencies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta moeda?")) {
      try {
        await currencyService.delete(id);
        setCurrencies((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        setError("Erro ao excluir moeda");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white pt-[100px]">
      <Header pageName="Moedas" />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar moeda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1e1e3f] border border-purple-500 px-4 py-2 rounded text-white"
          />
          <Button
            className="ml-4 bg-purple-700 hover:bg-purple-800"
            onClick={() => router.push("/currencies/create")}
          >
            Nova Moeda
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <table className="w-full text-left border border-purple-700">
          <thead className="bg-[#2a184e] text-purple-300">
            <tr>
              <th className="p-3 border border-purple-600">Nome</th>
              <th className="p-3 border border-purple-600">Descrição</th>
              <th className="p-3 border border-purple-600">Lastro</th>
              <th className="p-3 border border-purple-600">Status</th>
              <th className="p-3 border border-purple-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((currency) => (
              <tr
                key={currency.id}
                className="hover:bg-[#32264f] border-t border-purple-600"
              >
                <td className="p-3">{currency.name}</td>
                <td className="p-3">{currency.description}</td>
                <td className="p-3">{currency.backing}</td>
                <td className="p-3">{currency.status}</td>
                <td className="p-3 space-x-2">
                  <Button
                    variant="outline"
                    className="text-blue-400 border-blue-500 hover:bg-blue-900"
                    onClick={() => router.push(`/currencies/${currency.id}/view`)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    className="text-yellow-400 border-yellow-500 hover:bg-yellow-900"
                    onClick={() => router.push(`/currencies/${currency.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-400 border-red-500 hover:bg-red-900"
                    onClick={() => handleDelete(currency.id!)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-purple-300">
                  Nenhuma moeda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
