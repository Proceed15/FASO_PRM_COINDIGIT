"use client";

import React from "react";
import { Wallet, PlusCircle } from "lucide-react";

interface WalletListProps {
  wallets: any[];
  onSelect: (walletId: string) => void;
  onCreate: () => Promise<void>;
}

export default function WalletList({ wallets, onSelect, onCreate }: WalletListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Suas Carteiras</h2>

      {/* BOTÃO CRIAR NOVA */}
      <div className="flex justify-center mb-8">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl 
          shadow-md active:scale-95 transition-transform text-white font-medium"
        >
          <PlusCircle size={22} />
          Criar Nova Carteira
        </button>
      </div>

      {/* LISTA DE CARTEIRAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((w) => (
          <div
            key={w.walletId}
            onClick={() => onSelect(w.walletId)}
            className="cursor-pointer bg-[#162a6b] border border-white/20 rounded-xl p-6 flex flex-col 
            items-center hover:bg-[#1e3c94] active:scale-[0.98] transition-all shadow-lg"
          >
            <Wallet size={40} className="text-white mb-4" />

            <p className="text-white text-lg font-semibold mb-1">
              Carteira {w.walletId.substring(0, 8)}...
            </p>

            <p className="text-blue-300 font-medium">
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
