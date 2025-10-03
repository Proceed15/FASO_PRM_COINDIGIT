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
        console.error('Erro ao carregar moedas:', error);
        // CATCH
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
            currencies.map(c => currencyService.getHistory(c.id!))
          );
          const dataWithPrices = histories.map((history, index) => {
            const latestPrice = history.length > 0 ? history[history.length - 1].price : 0;
            return {
              name: currencies[index].symbol,
              price: latestPrice
            };
          }).filter(item => item.price > 0);

          // DECRESCENTE
          dataWithPrices.sort((a, b) => b.price - a.price);

          // 6 + CARAS
          const top6Expensive = dataWithPrices.slice(0, 6);

          setChartData(top6Expensive);
        } catch (error) {
          console.error('Erro ao carregar dados do gráfico:', error);
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
      {/* HEADER FIXO */}
      <Header pageName="DASHBOARD" />

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="my-[30px] flex-1 flex items-center justify-center px-4 py-6">
        <div className="mt-4 md:mt-0 w-full max-w-6xl space-y-10">
          {/* SECTION 1 - BOTÕES + GRÁFICO */}
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* BOTÕES AMARELOS - Navegação para páginas de moedas */}
            <div className="items-center justify-center flex flex-col gap-4 w-full md:w-[220px]">
              <Button
                onClick={() => router.push('/currencies')} // Redireciona para listagem de moedas
                className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full"
              >
                <Eye className="w-5 h-5" />
                Visualizar Moedas
              </Button>
              <Button
                onClick={() => router.push('/currencies/create')} // Redireciona para formulário de criação de moeda
                className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full"
              >
                <Plus className="w-5 h-5" />
                Adicionar Moedas
              </Button>
            </div>

            {/* CARD GRÁFICO - Exibe gráfico de preços das moedas mais populares */}
            <div className="flex-1 bg-[#0D1437] rounded-xl p-6 flex items-center justify-center w-full">
              {(loadingCurrencies || loadingChart) ? (
                // Mostra loading com spinner enquanto carrega dados
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD23F] mb-2"></div>
                  <p className="text-sm text-gray-300">Carregando gráfico de preços...</p>
                </div>
              ) : chartData.length === 0 ? (
                // Mensagem se não há dados para o gráfico
                <div className="text-center">
                  <p className="text-sm text-gray-300">Nenhum dado de preço disponível</p>
                </div>
              ) : (
                // Gráfico de barras com preços das top 6 moedas mais caras
                <div className="w-full">
                  <p className="text-sm text-gray-300 mb-4 font-semibold">Top 6 Moedas Mais Caras</p>
                  <Recharts.ResponsiveContainer width="100%" height={200}>
                    <Recharts.BarChart data={chartData}>
                      <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Recharts.XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
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
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Preço']}
                        labelFormatter={(label: string) => `${label}`}
                      />
                      <Recharts.Bar dataKey="price" fill="#FFD23F" radius={[4, 4, 0, 0]} />
                    </Recharts.BarChart>
                  </Recharts.ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2 - CONVERSOR */}
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

          {/* SECTION 3 - BOTÕES USUÁRIOS - Navegação para páginas de usuários */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button
              onClick={() => router.push(`/users/${user?.id}/edit`)} // Redireciona para edição do usuário logado (rota dinâmica /users/[id]/edit)
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full"
            >
              <User className="w-5 h-5" />
              Editar Usuário
            </Button>
            <Button
              onClick={() => router.push('/users')} // Redireciona para listagem de usuários
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full"
            >
              <Eye className="w-5 h-5" />
              Visualizar Usuários
            </Button>
            <Button
              onClick={() => router.push('/users/create')} // Redireciona para formulário de criação de usuário
              className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full"
            >
              <Plus className="w-5 h-5" />
              Adicionar Usuários
            </Button>
            {/* CAIXA DE BOAS-VINDAS - Mensagem dinâmica com nome do usuário logado */}
            <div className="bg-[#0D1437] mb-4 md:mb-0 py-6 rounded-xl flex items-center justify-center text-center w-full">
              <p>
                BEM VINDO AO <span className="font-bold">COINDIGIT!</span> <br />
                <span className="text-[#3DDC97] font-bold">{user?.name || 'Usuário'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
