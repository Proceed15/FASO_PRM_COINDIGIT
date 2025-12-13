// frontend/src/app/wallet/components/TransferToUserForm.tsx
"use client";

import { useContext, useState } from "react";
import { X, UserPlus } from "lucide-react";
import axios from "axios";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";

interface TransferToUserFormProps {
  walletId: string; // carteira de origem
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransferToUserForm({ walletId, onClose, onSuccess }: TransferToUserFormProps) {
  const { user } = useContext(UserContext);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientUserId, setRecipientUserId] = useState<number | null>(null);
  const [recipientWallets, setRecipientWallets] = useState<any[]>([]);
  const [toWalletId, setToWalletId] = useState<string>("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchUser = async () => {
    if (!recipientEmail) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/User/by-email?email=${encodeURIComponent(recipientEmail)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userFound = res.data;
      if (!userFound?.id) {
        setMessage("Usuário não encontrado.");
        setRecipientUserId(null);
        setRecipientWallets([]);
        setToWalletId("");
        return;
      }
      if (userFound.id === user?.id) {
        setMessage("Você digitou seu próprio email. Use o outro modal para transferir entre suas carteiras.");
        setRecipientUserId(null);
        setRecipientWallets([]);
        setToWalletId("");
        return;
      }

      setRecipientUserId(userFound.id);
      const walletsData = await walletService.getUserWallets(Number(userFound.id));
      setRecipientWallets(walletsData || []);
      setToWalletId(""); // deixa vazio para fallback na carteira padrão
      setMessage(`Usuário encontrado: ${userFound.name || userFound.email}`);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao buscar usuário.");
      setRecipientUserId(null);
      setRecipientWallets([]);
      setToWalletId("");
    }
  };

  const submit = async () => {
    if (!recipientUserId || !symbol || amount <= 0) {
      setMessage("Preencha todos os campos corretamente.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fromUserId: Number(user?.id),
        toUserId: recipientUserId,
        fromWalletId: walletId,
        toWalletId: toWalletId || undefined, // undefined → backend usa carteira padrão
        symbol: symbol.toUpperCase(),
        amount,
      };

      await walletService.transfer(payload);

      setMessage(`Transferência de ${amount} ${symbol.toUpperCase()} realizada com sucesso!`);
      await onSuccess();

      // Reset
      setRecipientEmail("");
      setRecipientUserId(null);
      setRecipientWallets([]);
      setToWalletId("");
      setSymbol("");
      setAmount(0);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.error || "Erro ao realizar transferência.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1b2c66] border border-white/20 rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-white text-lg font-semibold">
            <UserPlus size={23} /> Transferir para outro usuário
          </div>
          <button onClick={onClose} className="text-white hover:text-red-500 transition">
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-white">
          {/* Email */}
          <label>
            <span className="font-semibold">Email do Destinatário:</span>
            <div className="flex gap-2">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
                placeholder="exemplo@dominio.com"
              />
              <button
                type="button"
                onClick={searchUser}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md"
              >
                Buscar
              </button>
            </div>
          </label>

          {/* Carteira do destinatário */}
          {recipientWallets.length > 0 && (
            <label>
              <span className="font-semibold">Carteira do destinatário:</span>
              <select
                value={toWalletId}
                onChange={(e) => setToWalletId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              >
                <option value="">Carteira padrão</option>
                {recipientWallets.map((w: any) => (
                  <option key={w.walletId} value={w.walletId}>
                    {w.walletId.substring(0, 8)}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Símbolo */}
          <label>
            <span className="font-semibold">Símbolo:</span>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-md bg-[#0f1a45] border border-white/30 mt-1 text-white"
              placeholder="BTC, ETH..."
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

          {/* Mensagem */}
          {message && (
            <div
              className={`text-center px-3 py-2 rounded-md border 
              ${message.toLowerCase().includes("sucesso") || message.toLowerCase().includes("encontrado")
                  ? "text-green-400 bg-green-900/30 border-green-400"
                  : "text-red-400 bg-red-900/30 border-red-400"}`}
            >
              {message}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-md text-white shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-md text-white shadow-md"
            >
              {loading ? "Enviando..." : "Transferir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}