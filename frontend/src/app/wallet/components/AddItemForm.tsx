"use client";

import { useState, useContext } from "react";
import { X } from "lucide-react";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";

interface AddItemFormProps {
  walletId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemForm({ walletId, onClose, onSuccess }: AddItemFormProps) {
  const { user } = useContext(UserContext);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!symbol || amount <= 0) {
      alert("Preencha corretamente os campos.");
      return;
    }

    try {
      setLoading(true);
      await walletService.addItem(Number(user?.id), walletId, { symbol, amount });
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao adicionar item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1b2c66] border border-white/20 rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Adicionar Item</h2>

          <button
            onClick={onClose}
            className="text-white hover:text-blue-300 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4 text-white">
          <label>
            <span className="font-semibold">Simbolo:</span>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="BTC, ETH, USD..."
            />
          </label>

          <label>
            <span className="font-semibold">Quantidade:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="Ex: 2.5"
            />
          </label>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
            >
              Cancelar
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white active:scale-95 transition-transform"
            >
              {loading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
