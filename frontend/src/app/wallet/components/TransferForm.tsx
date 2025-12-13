"use client";

import { useContext, useEffect, useState } from "react";
import { X, HandCoins } from "lucide-react";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";

interface TransferFormProps {
  walletId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransferForm({ walletId, onClose, onSuccess }: TransferFormProps) {
  const { user } = useContext(UserContext);

  const [wallets, setWallets] = useState<any[]>([]);
  const [toWalletId, setToWalletId] = useState<string>("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // MENSAGEM DE SUCESSO
  const [successMessage, setSuccessMessage] = useState("");

  // CARREGAR WALLETS USUÁRIO PRA TRANSFER
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

  // Dentro do submit
  const submit = async () => {
    if (!symbol || amount <= 0 || !toWalletId) {
      setSuccessMessage("Preencha todos os campos corretamente.");
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

      // MENSAGEM MODAL COM CARTEIRA DE DESTINO
      setSuccessMessage(
        `Transferência de ${amount} ${symbol.toUpperCase()} realizada para a carteira ${toWalletId.substring(0, 8)}!`
      );

      // Atualiza a lista no componente pai
      await onSuccess();

      // NÃO FECHAR O MODAL automaticamente
    } catch (error) {
      console.error("Erro ao transferir:", error);
      setSuccessMessage("Erro ao realizar transferência.");
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
            <HandCoins size={23} />
            <span>Transferir Moeda</span>
          </div>

          {/* FECHAR */}
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4 text-white">

          {/* Carteira destino */}
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
                  {w.walletId.substring(0, 8)}
                </option>
              ))}
            </select>
          </label>

          {/* Simbolo */}
          <label>
            <span className="font-semibold">Símbolo:</span>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="BTC, ETH, USD..."
            />
          </label>

          {/* Quantidade */}
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

          {/* MENSAGEM DE SUCESSO / ERRO */}
          {successMessage && (
            <div className={`
              text-center px-3 py-2 rounded-md border 
              ${successMessage.includes("sucesso")
                ? "text-green-400 bg-green-900/30 border-green-400"
                : "text-red-400 bg-red-900/30 border-red-400"}
            `}>
              {successMessage}
            </div>
          )}

          {/* BOTÕES */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-md text-white shadow-md active:scale-95"
            >
              Cancelar
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-md text-white shadow-md active:scale-95"
            >
              {loading ? "Enviando..." : "Transferir"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
