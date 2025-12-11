"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createWalletItem } from "@/services/walletService";

export default function AddItemPage() {
  const { id } = useParams();
  const router = useRouter();

  const [currencyId, setCurrencyId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [usdValue, setUsdValue] = useState("");

  const handleSave = async () => {
    await createWalletItem({
      walletId: Number(id),
      currencyId: Number(currencyId),
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      usdValue: Number(usdValue),
    });

    router.push(`/wallet/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0a1647] text-white p-6">
      <h1 className="text-2xl font-bold text-[#FFD23F]">Adicionar Item</h1>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Currency ID"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={currencyId}
          onChange={(e) => setCurrencyId(e.target.value)}
        />

        <input
          placeholder="Quantidade"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          placeholder="Purchase Price"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />

        <input
          placeholder="USD Value"
          className="bg-[#11172b] p-3 border border-[#FFD23F] rounded w-full"
          value={usdValue}
          onChange={(e) => setUsdValue(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-[#FFD23F] px-4 py-2 rounded text-black font-bold"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
