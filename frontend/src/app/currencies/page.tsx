"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import { DeleteCurrencyDialog } from "@/components/dialogs/DeleteCurrencyDialog"; // importe

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
      } catch (e) {
        setError(`Erro ao carregar moedas:  ${e.message}`);
      }
    }
    fetchCurrencies();
  }, []);

  const filtered = currencies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await currencyService.delete(id);
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Erro ao excluir moeda");
    }
  };

  return (
    <div className="min-h-[1250px] bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white">
      <Header pageName="Moedas" />
      <div className="mb-[75px] mt-[75px] border border-white-500 rounded-xl max-w-6xl mx-auto p-6">
        <div className="flex justify-left items-center mb-6">
          <input
            type="text"
            placeholder="Buscar moeda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0e0e2f] border border-white-400 text-white rounded-lg px-4 py-2 w-full max-w-md outline-none"
          />
          <Button
            className="ml-4 border border-white-400 bg-tranparent text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
            onClick={() => router.push("/currencies/create")}
          >
            Nova Moeda
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
          <table className="w-full text-white bg-[#0e0e2f]">
            <thead className="bg-[#2a184e] text-purple-300">
              <tr>
                <th className="p-3 border-l border-r border-purple-600 text-left">Símbolo</th>
                <th className="p-3 border-l border-r border-purple-600 text-left">Nome</th>
                <th className="p-3 border-l border-r border-purple-600 text-left">Lastro</th>
                <th className="p-3 border-l border-r border-purple-600 text-left">Reverse</th>
                <th className="p-3 border-l border-r border-purple-600 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((currency) => (
                <tr
                  key={currency.id}
                  className="hover:bg-[#32264f] border-t border-purple-600"
                >
                  <td className="p-3 border-l border-r border-purple-600">{currency.symbol}</td>
                  <td className="p-3 border-l border-r border-purple-600">{currency.name}</td>
                  <td className="p-3 border-l border-r border-purple-600">{currency.backing}</td>
                  <td className="p-3 border-l border-r border-purple-600">
                    {currency.reverse ? "Sim" : "Não"}
                  </td>
                  <td className="p-3 space-x-2 flex items-center justify-center">
                    <Button
                      variant="outline"
                      className="text-blue-400 border-blue-500 hover:bg-blue-900"
                      onClick={() => router.push(`/currencies/${currency.id}/view`)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      className="text-yellow-400 border-yellow-500 hover:bg-yellow-900"
                      onClick={() => router.push(`/currencies/${currency.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <DeleteCurrencyDialog
                      currencyId={currency.id!}
                      currencyName={currency.name}
                      onDelete={handleDelete}
                      className="text-red-400 border-red-500 hover:bg-red-900"
                    />
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
    </div>
  );
}
