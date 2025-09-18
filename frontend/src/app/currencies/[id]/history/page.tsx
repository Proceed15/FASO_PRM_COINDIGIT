"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import LoadingScreen, { ChartLoadingSkeleton } from "@/components/common/LoadingScreen";
import { useApiLoading } from "@/hooks/useLoading";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CurrencyIconDetail } from "@/components/common/CurrencyIcon";

interface History {
  id: string;
  currencyId: string;
  price: number;
  date: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getAllMonthsOfYear(year: number): string[] {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
    months.push(yearMonth);
  }
  return months;
}

function groupHistoryByMonth(history: History[]) {
  const grouped: Record<string, number[]> = {};

  history.forEach((item) => {
    if (item.price == null || item.price === 0) return;

    const date = new Date(item.date);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!grouped[yearMonth]) {
      grouped[yearMonth] = [];
    }
    grouped[yearMonth].push(item.price);
  });

  const monthlyData = Object.entries(grouped).map(([month, prices]) => {
    const maxPrice = Math.max(...prices);
    return {
      month,
      price: maxPrice,
    };
  });

  monthlyData.sort(
    (a, b) =>
      new Date(a.month + "-01").getTime() -
      new Date(b.month + "-01").getTime()
  );

  return monthlyData;
}

function formatLargeNumber(value: number) {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
}

export default function CurrencyHistoryPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { loading, withLoading } = useApiLoading();

  const [history, setHistory] = useState<History[]>([]);
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    withLoading("fetch", async () => {
      try {
        const data = await currencyService.getHistory(id);
        setHistory(data);
        setError("");
      } catch (err) {
        setError("Erro ao carregar histórico.");
      }
    });

    currencyService
      .getById(id)
      .then(setCurrency)
      .catch(() => setError("Erro ao carregar moeda."));
  }, [id, withLoading]);

  const groupedData = groupHistoryByMonth(history);

  const months2025 = getAllMonthsOfYear(2025);
  const dataMap = new Map(groupedData.map((item) => [item.month, item.price]));

  const chartData = months2025.map((month) => ({
    date: month,
    price: dataMap.get(month) ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[#283976] text-white font-sans">
      <Header pageName="Gráfico de Cotação" />

      <main className="max-w-5xl mx-auto p-8 mt-[30px] mb-[30px] bg-[#171e33] rounded-xl shadow-lg text-base md:text-lg leading-relaxed space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-[45px] text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Histórico de Cotação - 2025
          </h2>
          {currency && (
            <div className="flex items-center justify-center md:justify-end gap-2 mt-3 md:mt-0 mr-0 md:mr-[15px] text-[#78ffef] text-lg md:text-xl font-semibold">
              <CurrencyIconDetail
                symbol={currency.symbol}
                className="w-6 h-6 md:w-7 md:h-7"
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {loading.fetch ? (
          <ChartLoadingSkeleton />
        ) : chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              Nenhum dado de histórico encontrado.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Tente novamente mais tarde ou verifique se há dados disponíveis
              para esta moeda.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
            >
              <CartesianGrid stroke="#8884d8" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#fff", fontSize: 12 }}
                interval={0}
                tickFormatter={(str: string) => {
                  const [year, month] = str.split("-");
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleString("pt-BR", { month: "short" });
                }}
                height={60}
              />
              <YAxis
                tick={{ fill: "#fff", fontSize: 12 }}
                domain={["auto", "auto"]}
                allowDecimals={true}
                tickFormatter={formatLargeNumber}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e3f",
                  border: "1px solid #8884d8",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
                labelFormatter={(label: string) => {
                  const [year, month] = label.split("-");
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <div className="w-full flex justify-end md:justify-end mt-6">
          <button
            onClick={() => router.push(`/currencies/${id}/view`)}
            className="w-[100px] h-[40px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150 rounded-lg"
            disabled={loading.fetch}
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
}
