"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { User, Eye, Plus, LineChart } from "lucide-react";

export default function DashboardPage() {
  const [amount, setAmount] = useState(200);

  return (
    <div className="min-h-screen bg-[#283976] text-white flex flex-col">
      {/* HEADER FIXO */}
      <Header pageName="DASHBOARD" />

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="mt-4 md:mt-0 w-full max-w-6xl space-y-10">
          {/* SECTION 1 - BOTÕES + GRÁFICO */}
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* BOTÕES AMARELOS */}
            <div className="flex flex-col gap-4 w-full md:w-[220px]">
              <Button className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full">
                <Eye className="w-5 h-5" />
                Visualizar Moedas
              </Button>
              <Button className="bg-[#FFD23F] text-black font-bold py-6 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2 w-full">
                <Plus className="w-5 h-5" />
                Adicionar Moedas
              </Button>
            </div>

            {/* CARD GRÁFICO */}
            <div className="flex-1 bg-[#0D1437] rounded-xl p-6 flex items-center justify-center w-full">
              <div className="text-center">
                <LineChart className="w-20 h-20 mx-auto text-teal-400" />
                <p className="mt-4 text-sm text-gray-300">
                  Gráfico de moedas novas/recentemente adicionadas
                </p>
              </div>
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

          {/* SECTION 3 - BOTÕES USUÁRIOS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full">
              <User className="w-5 h-5" />
              Editar Usuário
            </Button>
            <Button className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full">
              <Eye className="w-5 h-5" />
              Visualizar Usuários
            </Button>
            <Button className="bg-[#0D1437] hover:bg-[#1a1f4a] py-6 rounded-xl flex items-center justify-center gap-2 w-full">
              <Plus className="w-5 h-5" />
              Adicionar Usuários
            </Button>
            <div className="bg-[#0D1437] mb-4 md:mb-0 py-6 rounded-xl flex items-center justify-center text-center w-full">
              <p>
                BEM VINDO AO <span className="font-bold">COINDIGIT!</span> <br />
                <span className="text-[#3DDC97] font-bold">USER</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
