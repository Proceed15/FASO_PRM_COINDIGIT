"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWalletDetails, deleteWalletItem } from "@/services/walletService";
import Link from "next/link";

export default function WalletDetailsPage() {
  const { id } = useParams();
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    getWalletDetails(Number(id)).then((res) => setWallet(res.data));
  }, [id]);

  if (!wallet) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0a1647] text-white p-6">
      <h1 className="text-2xl font-bold text-[#FFD23F]">{wallet.name}</h1>

      <Link href={`/wallet/${id}/add-item`}>
        <button className="mt-4 bg-[#FFD23F] px-4 py-2 rounded text-black font-bold">
          + Adicionar Item
        </button>
      </Link>

      <div className="mt-6 space-y-4">
        {wallet.items.map((item: any) => (
          <div
            key={item.id}
            className="bg-[#11172b] p-4 border border-[#FFD23F] rounded-lg"
          >
            <p>Currency: {item.currencyId}</p>
            <p>Quantidade: {item.quantity}</p>
            <p>USD Value: {item.usdValue}</p>

            <button
              onClick={() => deleteWalletItem(item.id)}
              className="mt-3 bg-red-500 px-3 py-1 rounded"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
