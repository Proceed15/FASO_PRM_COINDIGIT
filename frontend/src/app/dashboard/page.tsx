"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { User, Eye, Plus, LineChart } from "lucide-react";
import { UserContext } from "@/contexts/UserContext";
import * as Recharts from "recharts";

export default function DashboardPage() {
  const [amount, setAmount] = useState(200);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; price: number }[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await currencyService.getAll();
        setCurrencies(data);
      } catch (error) {
        console.error("Erro ao carregar moedas:", error);
        setCurrencies([]);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      const fetchChartData = async () => {
        try {
          const histories = await Promise.all(
            currencies.map((c) => currencyService.getHistory(c.id!))
          );
          const dataWithPrices = histories
            .map((history, index) => {
              const latestPrice =
                history.length > 0 ? history[history.length - 1].price : 0;
              return {
                name: currencies[index].symbol,
                price: latestPrice,
              };
            })
            .filter((item) => item.price > 0);

          dataWithPrices.sort((a, b) => b.price - a.price);
          const top6Expensive = dataWithPrices.slice(0, 6);

          setChartData(top6Expensive);
        } catch (error) {
          console.error("Erro ao carregar dados do gráfico:", error);
          setChartData([]);
        } finally {
          setLoadingChart(false);
        }
      };

      fetchChartData();
    }
  }, [currencies]);

  return (
    <div className="min-h-screen bg-[#283976] text-white flex flex-col">
      <Header pageName="DASHBOARD" />

      <div className="my-[35px] flex-1 flex items-center justify-center px-4 py-6">
        <div className="mt-4 md:mt-0 w-full max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="items-center justify-center flex flex-col gap-4 w-full md:w-[220px]">
              <Button
                onClick={() => router.push("/currencies")}
                className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full transition duration-200 active:scale-95"
              >
                <Eye className="w-5 h-5" />
                Visualizar Moedas
              </Button>

              <Button
                onClick={() => router.push("/currencies/create")}
                className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full transition duration-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Adicionar Moedas
              </Button>
            </div>

            <div className="flex-1 bg-[#0D1437] rounded-xl p-6 flex items-center justify-center w-full">
              {loadingCurrencies || loadingChart ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD23F] mb-2"></div>
                  <p className="text-sm text-gray-300">Carregando gráfico de preços...</p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="text-center">
                  <p className="text-sm text-gray-300">Nenhum dado de preço disponível</p>
                </div>
              ) : (
                <div className="w-full">
                  <p className="text-sm text-gray-300 my-4 font-semibold">
                    Top 6 Moedas Mais Caras
                  </p>
                  <Recharts.ResponsiveContainer width="100%" height={200}>
                    <Recharts.BarChart data={chartData}>
                      <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Recharts.XAxis
                        dataKey="name"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <Recharts.YAxis
                        fontSize={10}
                        width={60}
                        tickFormatter={(value: number) => {
                          if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                          return `$${value.toFixed(2)}`;
                        }}
                      />
                      <Recharts.Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Preço"]}
                        labelFormatter={(label: string) => `${label}`}
                      />
                      <Recharts.Bar dataKey="price" fill="#FFD23F" radius={[4, 4, 0, 0]} />
                    </Recharts.BarChart>
                  </Recharts.ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
{/*
          <div className="bg-[#0D1437] p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center justify-center w-full">
            <select className="bg-[#283976] border border-gray-500 px-3 py-2 rounded-lg w-full md:w-auto">
              <option>USD - United States Dollar</option>
            </select>

            <span className="text-xl">⇄</span>

            <select className="bg-[#283976] border border-gray-500 px-3 py-2 rounded-lg w-full md:w-auto">
              <option>BTC - Bitcoin</option>
            </select>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-[#283976] border border-gray-500 px-3 py-2 rounded-lg w-full md:w-[120px] text-center"
            />

            <span className="text-2xl font-bold text-[#FFD23F] text-center">
              = 0,2000000
            </span>
          </div>
*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button
              onClick={() => router.push(`/users/${user?.id}/edit`)}
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full transition duration-200 active:scale-95"
            >
              <User className="w-5 h-5" />
              Editar Usuário
            </Button>

            <Button
              onClick={() => router.push("/users")}
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full transition duration-200 active:scale-95"
            >
              <Eye className="w-5 h-5" />
              Visualizar Usuários
            </Button>

            <Button
              onClick={() => router.push("/users/create")}
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full transition duration-200 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Adicionar Usuários
            </Button>

            <div className="bg-[#0D1437] mb-4 md:mb-0 py-6 rounded-xl flex items-center justify-center text-center w-full">
              <p>
                BEM VINDO AO <span className="font-bold">COINDIGIT!</span> <br />
                <span className="text-[#3DDC97] font-bold">
                  {user?.name || "Usuário"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
