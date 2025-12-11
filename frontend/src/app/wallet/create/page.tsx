"use client";

import { useState } from "react";
import { createWallet } from "@/services/walletService";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";

export default function CreateWalletPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    await createWallet({ userId: 101, name });
    router.push("/wallet");
  };

  return (
    <div className="min-h-screen bg-[#0a1647] text-white">
      <Header pageName="Criar Wallet" />

      <div className="max-w-2xl mx-auto mt-10 bg-[#171e33] p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#FFD23F]">Nova Wallet</h1>

        <input
          className="w-full mt-4 p-3 bg-[#11172b] border border-[#FFD23F] rounded text-white"
          placeholder="Nome da Wallet"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="mt-4 bg-[#FFD23F] px-4 py-2 text-black rounded font-bold"
        >
          Criar
        </button>
      </div>
    </div>
  );
}
