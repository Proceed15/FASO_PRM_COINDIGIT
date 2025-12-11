"use client";

import { useState, useEffect, useContext } from "react";
import { ArrowLeft, Trash2, PlusCircle, HandCoins } from "lucide-react";
import AddItemForm from "./AddItemForm";
import TransferForm from "./TransferForm";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";

interface WalletDetailsProps {
  wallet: any;
  onBack: () => void;
  refreshWallet: () => Promise<void>;
}

export default function WalletDetails({ wallet, onBack, refreshWallet }: WalletDetailsProps) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(wallet.items || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    setItems(wallet.items || []);
  }, [wallet]);

  const removeItem = async (symbol: string) => {
    if (!confirm(`Tem certeza que deseja remover ${symbol}?`)) return;

    try {
      setLoading(true);
      await walletService.deleteItem(Number(user?.id), wallet.walletId, symbol);
      await refreshWallet();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">

      {/* VOLTAR */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-blue-300 mb-6"
      >
        <ArrowLeft size={22} /> Voltar
      </button>

      <h2 className="text-3xl font-bold mb-4">
        Carteira {wallet.walletId.substring(0, 12)}...
      </h2>

      <p className="text-xl text-blue-300 mb-6">
        Total: <span className="font-bold">${wallet.totalUsd?.toFixed(2)}</span>
      </p>

      {/* BOTÕES */}
      <div className="flex gap-4 mb-8">

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl active:scale-95 transition text-white"
        >
          <PlusCircle size={20} /> Adicionar Item
        </button>

        <button
          onClick={() => setShowTransfer(true)}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-xl active:scale-95 transition text-white"
        >
          <HandCoins size={20} /> Transferir
        </button>
      </div>

      {/* LISTA DE ITEMS */}
      <div className="bg-[#162a6b] border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Itens da Carteira</h3>

        {items.length === 0 && (
          <p className="text-gray-300">Nenhum item nesta carteira.</p>
        )}

        {items.length > 0 && (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2">Moeda</th>
                <th>Quantidade</th>
                <th>Preço USD</th>
                <th>Total USD</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.symbol} className="border-b border-white/10">
                  <td className="py-2 font-medium">{item.symbol}</td>
                  <td>{item.amount}</td>
                  <td>${item.lastPriceUsd}</td>
                  <td>${item.totalUsd}</td>
                  <td>
                    <button
                      onClick={() => removeItem(item.symbol)}
                      disabled={loading}
                      className="text-red-400 hover:text-red-600 active:scale-90 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ADD ITEM */}
      {showAddForm && (
        <AddItemForm
          walletId={wallet.walletId}
          onClose={() => setShowAddForm(false)}
          onSuccess={async () => {
            await refreshWallet();
            setShowAddForm(false);
          }}
        />
      )}

      {/* MODAL TRANSFER */}
      {showTransfer && (
        <TransferForm
          walletId={wallet.walletId}
          onClose={() => setShowTransfer(false)}
        />
      )}
    </div>
  );
}
