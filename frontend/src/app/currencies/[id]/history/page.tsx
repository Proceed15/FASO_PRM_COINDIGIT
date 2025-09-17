"use client";

import React, { useEffect, useState, use } from "react";
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
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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

    monthlyData.sort((a, b) => new Date(a.month + "-01").getTime() - new Date(b.month + "-01").getTime());

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

    const [history, setHistory] = useState<History[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        currencyService
            .getHistory(id)
            .then(data => {
                console.log("Dados recebidos do serviço:", data);
                setHistory(data);
            })
            .catch(() => setError("Erro ao carregar histórico."));
    }, [id]);

    const groupedData = groupHistoryByMonth(history);
    console.log("Dados agrupados por mês:", groupedData);

    const months2025 = getAllMonthsOfYear(2025);
    const dataMap = new Map(groupedData.map(item => [item.month, item.price]));

    const chartData = months2025.map(month => ({
        date: month,
        price: dataMap.get(month) ?? 0,
    }));

    console.log("Dados para o gráfico:", chartData);

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
                                interval={0}
                                tickFormatter={(str) => {
                                    const [year, month] = str.split("-");
                                    const date = new Date(Number(year), Number(month) - 1);
                                    return date.toLocaleString("pt-BR", { month: "short" });
                                }}
                                height={60}
                            />
                            <YAxis
                                tick={{ fill: "#fff", fontSize: 12 }}
                                domain={['auto', 'auto']}
                                allowDecimals={true}
                                tickFormatter={formatLargeNumber}
                                width={80}
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
                                connectNulls={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => router.push(`/currencies/${id}/view`)}
                        className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition text-base font-medium"
                    >
                        Voltar
                    </button>
                </div>
            </main>
        </div>
    );
}