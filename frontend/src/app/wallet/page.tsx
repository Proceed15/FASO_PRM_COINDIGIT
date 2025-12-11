"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { getWalletsByUser } from "@/services/walletService";
import Link from "next/link";

export default function WalletPage() {
  const userId = 101; // TEMPORÁRIO — enquanto não integra com Auth
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    getWalletsByUser(userId).then((res) => setWallets(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1647] text-white">
      <Header pageName="Wallets" />

      <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#171e33] rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#FFD23F]">Minhas Wallets</h1>

        <Link href="/wallet/create">
          <button className="mt-4 bg-[#FFD23F] text-black px-4 py-2 rounded font-bold">
            Criar nova Wallet
          </button>
        </Link>

        <div className="mt-6 space-y-4">
          {wallets.map((w: any) => (
            <Link key={w.id} href={`/wallet/${w.id}`}>
              <div className="p-4 bg-[#11172b] border border-[#FFD23F] rounded-lg cursor-pointer hover:bg-[#0f1426]">
                <p className="text-lg font-bold">{w.name}</p>
                <p className="opacity-70">ID: {w.id}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
