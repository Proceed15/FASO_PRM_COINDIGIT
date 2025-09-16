"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService from "@/services/currencyService";
import Header from "@/components/common/Header";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface History {
    id: string;
    currencyId: string;
    price: number;
    date: string;
}

interface PageProps {
    params: {
        id: string;
    };
}

// Gera todos os meses do ano especificado no formato "YYYY-MM"
function getAllMonthsOfYear(year: number): string[] {
    const months = [];
    for (let month = 0; month < 12; month++) {
        const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
        months.push(yearMonth);
    }
    return months;
}

// Agrupa histórico por mês, filtrando preços inválidos (null, undefined, 0)
function groupHistoryByMonth(history: History[]) {
    const grouped: Record<string, History[]> = {};

    history.forEach((item) => {
        if (item.price == null || item.price === 0) return; // filtra preços inválidos

        const date = new Date(item.date);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!grouped[yearMonth]) {
            grouped[yearMonth] = [];
        }
        grouped[yearMonth].push(item);
    });

    const monthlyData = Object.entries(grouped).map(([month, items]) => {
        // Ordena do mais recente para o mais antigo para pegar preço de fechamento válido
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            month,
            price: items[0].price,
        };
    });

    // Ordena cronologicamente
    monthlyData.sort((a, b) => new Date(a.month + "-01").getTime() - new Date(b.month + "-01").getTime());

    return monthlyData;
}

// Formata números grandes para K, M, B
function formatLargeNumber(value: number) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
}

export default function CurrencyHistoryPage({ params }: PageProps) {
    const router = useRouter();
    const [history, setHistory] = useState<History[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        currencyService
            .getHistory(params.id)
            .then(setHistory)
            .catch(() => setError("Erro ao carregar histórico."));
    }, [params.id]);

    const groupedData = groupHistoryByMonth(history);
    const months2025 = getAllMonthsOfYear(2025);

    // Mapa para acesso rápido dos preços por mês
    const dataMap = new Map(groupedData.map(item => [item.month, item.price]));

    // Monta dados para o gráfico com todos os meses de 2025, preenchendo com 0 se não tiver dado
    const chartData = months2025.map(month => ({
        date: month,
        price: dataMap.get(month) ?? 0,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white font-sans">
            <Header pageName="Gráfico de Cotação" />

            <main className="max-w-5xl mx-auto mt-16 mb-10 p-8 bg-[#1e1e3f] rounded-xl shadow-lg text-base md:text-lg leading-relaxed space-y-6">
                <h2 className="text-3xl font-bold text-white">Histórico de Cotação - 2025</h2>

                {error && <p className="text-red-500">{error}</p>}

                {chartData.length === 0 ? (
                    <p className="text-gray-300">Nenhum dado de histórico encontrado.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 0 }}>
                            <CartesianGrid stroke="#8884d8" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "#fff", fontSize: 12 }}
                                interval={0} // mostra todos os meses
                                tickFormatter={(str) => {
                                    const [year, month] = str.split("-");
                                    const date = new Date(Number(year), Number(month) - 1);
                                    return date.toLocaleString("pt-BR", { month: "short" });
                                }}
                                height={60} // para não cortar o texto
                            />
                            <YAxis
                                tick={{ fill: "#fff", fontSize: 12 }}
                                domain={['auto', 'auto']}
                                allowDecimals={true}
                                tickFormatter={formatLargeNumber}
                                width={80} // espaço maior para ticks grandes
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e1e3f", border: "1px solid #8884d8" }}
                                labelStyle={{ color: "#fff" }}
                                itemStyle={{ color: "#fff" }}
                                formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                labelFormatter={(label) => {
                                    const [year, month] = label.split("-");
                                    const date = new Date(Number(year), Number(month) - 1);
                                    return date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={false}
                                connectNulls={true} // conecta pontos ignorando nulls (não teremos nulls)
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => router.push(`/currencies/${params.id}/view`)}
                        className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition text-base font-medium"
                    >
                        Voltar
                    </button>
                </div>
            </main>
        </div>
    );
}