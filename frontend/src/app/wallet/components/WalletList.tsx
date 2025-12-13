"use client";

import React from "react";
import { Wallet, PlusCircle } from "lucide-react";

interface WalletListProps {
  wallets: any[];
  onSelect: (walletId: string) => void;
  onCreate: () => Promise<void>;
}

export default function WalletList({ wallets, onSelect, onCreate }: WalletListProps) {
  const totalFundos = wallets.reduce((sum, w) => sum + (w.totalUsd || 0), 0);
  return (
    <div className="mt-6 mb-10">

      <div className="mt-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-4 mb-8 w-full">

        {/* TOTAL DE FUNDOS */}
        <div className="w-full border-2 border-white rounded-lg h-[45px] bg-transparent flex items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            TOTAL DE FUNDOS: ${totalFundos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h2>
        </div>

        {/* BOTÃO CRIAR NOVA */}
        <div className="w-full md:w-[350px] flex justify-center md:justify-end">
          <button
            onClick={onCreate}
            className="w-full sm:w-auto border-2 border-transparent bg-yellow-500 flex items-center gap-2 
        hover:bg-yellow-400 px-5 py-3 rounded-xl shadow-md active:scale-95 active:border-white 
        transition-transform duration-150 text-white font-semibold"
          >
            <PlusCircle size={22} />
            Criar Nova Carteira
          </button>
        </div>

      </div>

      {/* LISTA DE CARTEIRAS CARD*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((w) => (
          <div
            key={w.walletId}
            onClick={() => onSelect(w.walletId)}
            className="cursor-pointer bg-[#171e33] border border-yellow-400/50 rounded-xl p-6 flex flex-col 
            items-center hover:bg-[#265dbf] active:scale-[0.98] transition-all shadow-lg"
          >
            <Wallet size={35} className="text-white mb-4" />

            <p className="text-white text-lg font-semibold mb-1">
              Carteira {w.walletId.substring(0, 8)}
            </p>

            <p className="text-yellow-300 font-medium">
              Total: <span className="font-bold">${w.totalUsd?.toFixed(2)}</span>
            </p>
          </div>
        ))}
      </div>



      {/* VAZIO */}
      {wallets.length === 0 && (
        <p className="text-center text-gray-300 mt-10 text-lg">
          Você ainda não possui carteiras cadastradas.
        </p>
      )}
    </div>
  );
}
