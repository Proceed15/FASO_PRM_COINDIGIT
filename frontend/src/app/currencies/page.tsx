"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { DeleteCurrencyDialog } from "@/components/dialogs/DeleteCurrencyDialog";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Clock } from "lucide-react";

export default function CurrencyListPage() {
  
  const router = useRouter();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<keyof Currency | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const pageSize = 7;

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const data = await currencyService.getAll();
        setCurrencies(data);
      } catch (e: any) {
        setError(`Erro ao carregar moedas: ${e.message}`);
      }
    }
    fetchCurrencies();
  }, []);

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await currencyService.delete(id);
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Erro ao excluir moeda");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Currency) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredCurrencies = currencies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      return sortDirection === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedCurrencies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCurrencies = sortedCurrencies.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (column: keyof Currency) => {
    if (sortColumn !== column) {
      return (
        <span className="text-[#3fadc0] opacity-50">
          <ChevronUp size={14} className="-mb-1" />
          <ChevronDown size={14} className="-mt-1" />
        </span>
      );
    }

    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="min-h-screen items-center justify-start bg-[#283976] text-white">
      <Header pageName="Lista de Moedas" />
      {error && <div className="text-red-500 my-4">{error}</div>}
      <div className="flex flex-col items-center justify-start">
        <div className="mb-[40px] mt-[40px] w-full max-w-6xl px-4">

          {/* PESQUISA + ADD */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-left mb-6 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar moeda..."
              className="bg-[#11172b] border border-[#00d9ff] text-white rounded-lg px-3 py-2 w-full sm:max-w-md outline-none"
            />
            <Button
              className="bg-[#3fadc0] hover:bg-cyan-600 text-white font-semibold rounded px-4 py-2"
              onClick={() => router.push("/currencies/create")}
            >
              Nova Moeda
            </Button>
          </div>

          {/* TABELA */}
          <div className="border-2 border-[#00d9ff] rounded-lg overflow-x-auto">
            <table className="min-w-[600px] w-full text-white bg-[#171e33]">
              <thead className="bg-[#11172b] text-[#3fadc0]">
                <tr>
                  <th onClick={() => handleSort("symbol")} className="text-left px-4 py-3 border-r border-[#00d9ff] cursor-pointer">
                    <div className="flex items-center gap-1">
                      Símbolo
                      {renderSortIcon("symbol")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("name")} className="text-left px-4 py-3 border-r border-[#00d9ff] cursor-pointer">
                    <div className="flex items-center gap-1">
                      Nome
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("backing")} className="text-left px-4 py-3 border-r border-[#00d9ff] cursor-pointer">
                    <div className="flex items-center gap-1">
                      Lastro
                      {renderSortIcon("backing")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("reverse")} className="text-left px-4 py-3 border-r border-[#00d9ff] cursor-pointer">
                    <div className="flex items-center gap-1">
                      Reverso
                      {renderSortIcon("reverse")}
                    </div>
                  </th>
                  <th className="text-center px-4 py-3 border-[#00d9ff]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCurrencies.map((currency) => (
                  <tr key={currency.id} className="hover:bg-[#11172b] transition">
                    <td className="px-4 py-2 border-t border-r border-[#00d9ff]">{currency.symbol}</td>
                    <td className="px-4 py-2 border-t border-r border-[#00d9ff]">{currency.name}</td>
                    <td className="px-4 py-2 border-t border-r border-[#00d9ff]">{currency.backing}</td>
                    <td className="px-4 py-2 border-t border-r border-[#00d9ff]">
                      {currency.reverse ? "Sim" : "Não"}
                    </td>
                    <td className="text-center px-4 py-2 border-t border-[#00d9ff]">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          className="p-2"
                          onClick={() => router.push(`/currencies/${currency.id}/history`)}
                          title="Ver histórico"
                        >
                          <Clock size={20} className="text-green-400 hover:text-green-200" />
                        </button>
                        <button
                          className="p-2"
                          onClick={() => router.push(`/currencies/${currency.id}/view`)}
                          title="Visualizar moeda"
                        >
                          <Eye size={22} className="text-cyan-400 hover:text-cyan-200" />
                        </button>

                        <button
                          className="p-2"
                          onClick={() => router.push(`/currencies/${currency.id}/edit`)}
                          title="Editar moeda"
                        >
                          <Pencil size={20} className="text-yellow-400 hover:text-yellow-200" />
                        </button>

                        <DeleteCurrencyDialog
                          currencyId={currency.id!}
                          currencyName={currency.name}
                          onDelete={handleDelete}
                          icon={<Trash2 size={20} className="text-red-500 hover:text-red-300" />}
                          className="p-2"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          <div className="mt-[20px] mb-[20px] flex flex-wrap justify-end items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded hover:text-cyan-600 disabled:opacity-40 text-sm sm:text-base flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${currentPage === i + 1 ? "bg-[#3fadc0] text-white" : "hover:bg-cyan-600"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded hover:text-cyan-600 disabled:opacity-40 text-sm sm:text-base flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
