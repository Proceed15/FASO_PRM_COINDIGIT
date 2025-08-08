/*/ TABELA -> 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService from "@/services/currencyService";
import Header from "@/components/common/Header";

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

    //MAX DEZ
    const limitedHistory = [...history]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
/*
    return (
        //min-h-[600px]
        <div className="min-h-[950px] bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white">
            <Header pageName="Histórico de Cotação" />
            <div className="max-w-5xl mx-auto mt-20 mb-10 p-6 bg-[#1e1e3f] rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6">Histórico de Cotação</h2>

                {error && <p className="text-red-500">{error}</p>}

                {limitedHistory.length === 0 ? (
                    <p>Nenhum dado de histórico encontrado.</p>
                ) : (
                    <div className="border-2 border-purple-500 rounded-lg overflow-hidden mt-6">
                        <table className="w-full text-white bg-[#0e0e2f]">
                            <thead className="bg-[#2a184e] text-purple-300">
                                <tr>
                                    <th className="p-3 border-l border-r border-purple-600 text-left">Data</th>
                                    <th className="p-3 border-l border-r border-purple-600 text-left">Preço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {limitedHistory.map((h) => (
                                    <tr key={h.id} className="hover:bg-[#32264f] border-t border-purple-600">
                                        <td className="p-3 border-l border-r border-purple-600">
                                            {new Date(h.date).toLocaleString("pt-BR")}
                                        </td>
                                        <td className="p-3 border-l border-r border-purple-600">
                                            R$ {h.price.toFixed(4)}
                                        </td>
                                    </tr>
                                ))}

                                {limitedHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-6 text-center text-purple-300">
                                            Nenhum histórico encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => router.push(`/currencies/${params.id}/view`)}
                        className=" bg-purple-700 border border-white-400 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform font-semibold rounded px-4 py-2"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
*/

// TENTATIVA DE GRÁFICO
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

    const chartData = history.map((h) => ({
        date: new Date(h.date).toLocaleDateString("pt-BR"), 
        price: h.price,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white font-sans">
            <Header pageName="Gráfico de Cotação" />

            <main className="max-w-5xl mx-auto mt-16 mb-10 p-8 bg-[#1e1e3f] rounded-xl shadow-lg text-base md:text-lg leading-relaxed space-y-6">
                <h2 className="text-3xl font-bold text-white">Histórico de Cotação</h2>

                {error && <p className="text-red-500">{error}</p>}

                {chartData.length === 0 ? (
                    <p className="text-gray-300">Nenhum dado de histórico encontrado.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                            <CartesianGrid stroke="#8884d8" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "#fff", fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis tick={{ fill: "#fff", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e1e3f", border: "1px solid #8884d8" }}
                                labelStyle={{ color: "#fff" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={false}
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
