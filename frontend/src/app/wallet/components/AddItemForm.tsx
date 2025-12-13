"use client";

import { useState, useContext } from "react";
import { X, PlusCircle } from "lucide-react";
import { UserContext } from "@/contexts/UserContext";
import walletService from "../../../services/walletService";

interface AddItemFormProps {
  walletId: string;
  walletItems: any[];
  onClose: () => void;
  onSuccess: (updatedItems: any[]) => void; // retorna itens atualizados
}

export default function AddItemForm({ walletId, walletItems, onClose, onSuccess }: AddItemFormProps) {
  const { user } = useContext(UserContext);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submit = async () => {
    if (!symbol || amount <= 0) {
      setSuccessMessage("Preencha corretamente os campos.");
      return;
    }
    if (!user?.id) {
      setSuccessMessage("Você precisa estar logado.");
      return;
    }

    try {
      setLoading(true);

      const upperSymbol = symbol.toUpperCase();

      // Persistir no backend para calcular lastPriceUsd/totalUsd e salvar
      const resp = await walletService.addItem(
        Number(user.id),
        walletId,
        { symbol: upperSymbol, amount }
      );

      // resp é o WalletSummaryDto → use os itens retornados pelo backend
      onSuccess(resp.items || []);

      setSuccessMessage(`${amount} ${upperSymbol} adicionadas com sucesso!`);
      setSymbol("");
      setAmount(0);
    } catch (error: any) {
      console.error("Erro ao adicionar item:", error);
      const msg = error?.response?.data?.error || "Erro ao adicionar item.";
      setSuccessMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1b2c66] border border-white/20 rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-white text-lg font-semibold">
            <PlusCircle size={23} />
            <span>Adicionar Moeda</span>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-500 transition">
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
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="BTC, ETH ..."
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

          {successMessage && (
            <div
              className={`text-center px-3 py-2 rounded-md border ${successMessage.includes("sucesso")
                  ? "text-green-400 bg-green-900/30 border-green-400"
                  : "text-red-400 bg-red-900/30 border-red-400"
                }`}
            >
              {successMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-5 py-2 bg-red-500 hover:bg-red-400 rounded-xl text-white">
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-5 py-2 bg-green-500 hover:bg-green-400 rounded-xl text-white"
            >
              {loading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}