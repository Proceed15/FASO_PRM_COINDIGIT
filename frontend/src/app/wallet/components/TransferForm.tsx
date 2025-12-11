"use client";

import { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";

interface TransferFormProps {
  walletId: string;
  onClose: () => void;
}

export default function TransferForm({ walletId, onClose }: TransferFormProps) {
  const { user } = useContext(UserContext);

  const [wallets, setWallets] = useState<any[]>([]);
  const [toWalletId, setToWalletId] = useState<string>("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  // Carregar carteiras do usuário (para selecionar destino)
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;

      try {
        const data = await walletService.getUserWallets(Number(user.id));
        const filtered = data.filter((w: any) => w.walletId !== walletId);
        setWallets(filtered);
      } catch (error) {
        console.error("Erro ao carregar carteiras:", error);
      }
    };

    load();
  }, [user, walletId]);

  const submit = async () => {
    if (!symbol || amount <= 0 || !toWalletId) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    try {
      setLoading(true);

      await walletService.transfer({
        fromUserId: Number(user?.id),
        toUserId: Number(user?.id),
        fromWalletId: walletId,
        toWalletId,
        symbol,
        amount,
      });

      alert("Transferência realizada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao transferir:", error);
      alert("Erro na transferência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1b2c66] border border-white/20 rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Transferir Itens</h2>

          <button
            onClick={onClose}
            className="text-white hover:text-blue-300 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* CAMPOS */}
        <div className="flex flex-col gap-4 text-white">
          {/* walletId destino */}
          <label>
            <span className="font-semibold">Carteira Destino:</span>
            <select
              value={toWalletId}
              onChange={(e) => setToWalletId(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
            >
              <option value="">Selecione...</option>
              {wallets.map((w) => (
                <option key={w.walletId} value={w.walletId}>
                  {w.walletId.substring(0, 12)}...
                </option>
              ))}
            </select>
          </label>

          {/* simbolo */}
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

          {/* quantidade */}
          <label>
            <span className="font-semibold">Quantidade:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="Ex: 1.25"
            />
          </label>

          {/* BOTÕES */}
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
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white active:scale-95 transition-transform"
            >
              {loading ? "Enviando..." : "Transferir"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
