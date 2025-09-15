import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import currencyService from "@/services/currencyService";
import Header from "@/components/common/Header";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
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
    const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString());

    useEffect(() => {
        if (!params?.id) return;

        currencyService
            .getHistory(params.id)
            .then((data) => {
                const filteredData = data.filter((h) => {
                    const date = new Date(h.date);
                    return date.getUTCFullYear().toString() === selectedYear;
                });
                setHistory(filteredData);
            })
            .catch(() => setError("Erro ao carregar histórico."));
    }, [selectedYear]);

    function getCurrentYear() {
        return new Date().getFullYear();
    }

    const years = [
        getCurrentYear().toString(),
        (getCurrentYear() - 1).toString(),
        (getCurrentYear() - 2).toString(),
    ];

    // Prepara dados do gráfico por mês
    const chartData = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const monthData = history.filter(
            (h) => new Date(h.date).getMonth() + 1 === month
        );

        const averagePrice =
            monthData.length > 0
                ? monthData.reduce((sum, h) => sum + h.price, 0) / monthData.length
                : 0;

        return {
            month: new Date(0, month - 1).toLocaleString("pt-BR", { month: "long" }),
            price: averagePrice,
        };
    });

    // Completa meses sem dados com o último preço conhecido
    const completeChartData = chartData.reduce((acc, current, index) => {
        if (index === 0) {
            acc.push(current);
        } else {
            const lastValue = acc[acc.length - 1].price || 0;
            acc.push({
                ...current,
                price: current.price === 0 ? lastValue : current.price,
            });
        }
        return acc;
    }, [] as { month: string; price: number }[]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white font-sans">
            <Header pageName="Histórico de Cotação" />
            <div className="max-w-5xl mx-auto mt-16 mb-10 p-8 bg-[#1e1e3f] rounded-xl shadow-lg text-base md:text-lg leading-relaxed space-y-6">
                <h2 className="text-3xl font-bold text-white">Histórico de Cotação</h2>

                {error && <p className="text-red-500">{error}</p>}

                {/* Filtro de Ano */}
                <div className="flex justify-between mb-6">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="p-2 rounded-lg bg-[#1e1e3f] text-white border border-purple-600"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gráfico */}
                {completeChartData.length === 0 ? (
                    <p className="text-gray-300">Nenhum dado de histórico encontrado.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={completeChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#777" />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#fff", fontSize: 12 }}
                                interval={0}
                            />
                            <YAxis
                                tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
                                tick={{ fill: "#fff", fontSize: 12 }}
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e1e3f",
                                    border: "1px solid #8884d8",
                                }}
                                labelStyle={{ color: "#fff" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {/* Botão de Voltar */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => router.push(`/currencies/${params.id}/view`)}
                        className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition text-base font-medium"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
