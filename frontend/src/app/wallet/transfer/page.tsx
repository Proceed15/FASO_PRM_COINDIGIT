"use client";

import { useState } from "react";
import { transferBetweenWallets } from "@/services/walletService";

export default function TransferPage() {
  const [walletFrom, setWalletFrom] = useState("");
  const [walletTo, setWalletTo] = useState("");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [type, setType] = useState("transfer");

  const handleTransfer = async () => {
    await transferBetweenWallets({
      walletFrom: Number(walletFrom),
      walletTo: Number(walletTo),
      amount: Number(amount),
      fee: Number(fee),
      type,
    });

    alert("Transferência realizada!");
  };

  return (
    <div className="min-h-screen bg-[#0a1647] text-white p-6">
      <h1 className="text-2xl font-bold text-[#FFD23F]">Transferência</h1>

      <div className="mt-6 space-y-4">
        <input
          placeholder="De (walletId)"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={walletFrom}
          onChange={(e) => setWalletFrom(e.target.value)}
        />

        <input
          placeholder="Para (walletId)"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={walletTo}
          onChange={(e) => setWalletTo(e.target.value)}
        />

        <input
          placeholder="Valor"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Taxa (fee)"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />

        <select
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="deposit">Depósito</option>
          <option value="withdraw">Saque</option>
          <option value="transfer">Transferência</option>
        </select>

        <button
          onClick={handleTransfer}
          className="bg-[#FFD23F] px-4 py-2 rounded text-black font-bold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
