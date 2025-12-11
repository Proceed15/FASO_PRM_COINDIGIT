"use client";

import { useContext, useEffect, useState } from "react";
import Header from "@/components/common/Header";
import LoadingScreen from "@/components/common/LoadingScreen";
import { UserContext } from "@/contexts/UserContext";
import walletService from "../../services/walletService";

import WalletList from "./components/WalletList";
import WalletDetails from "./components/WalletDetails";

export default function WalletPage() {
  const { user, isLoading } = useContext(UserContext);

  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  const [loadingWallets, setLoadingWallets] = useState(true);

  const loadWallets = async () => {
    if (!user?.id) return;

    try {
      setLoadingWallets(true);
      const data = await walletService.getUserWallets(Number(user.id));
      setWallets(data);
    } catch (error) {
      console.error("Erro ao carregar carteiras:", error);
    } finally {
      setLoadingWallets(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadWallets();
  }, [user]);

  if (isLoading || loadingWallets) {
    return <LoadingScreen message="Carregando sua carteira..." />;
  }

  if (!user?.id) {
    return (
      <div className="text-white p-8">
        <Header pageName="Carteira" />
        <p className="text-center text-xl mt-10">
          Você precisa estar logado para acessar sua carteira.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1647] text-white">
      <Header pageName="Carteira" />

      <div className="container mx-auto px-6 py-8">

        {/* LISTA DE CARTEIRAS */}
        {!selectedWallet && (
          <WalletList
            wallets={wallets}
            onSelect={(walletId) =>
              setSelectedWallet(wallets.find((w) => w.walletId === walletId))
            }
            onCreate={async () => {
              await walletService.createWallet(Number(user.id));
              await loadWallets();
            }}
          />
        )}

        {/* DETALHES DA CARTEIRA */}
        {selectedWallet && (
          <WalletDetails
            wallet={selectedWallet}
            onBack={() => {
              setSelectedWallet(null);
              loadWallets();
            }}
            refreshWallet={async () => {
              const fresh = await walletService.getWalletDetails(
                Number(user.id),
                selectedWallet.walletId
              );
              setSelectedWallet(fresh);
            }}
          />
        )}
      </div>
    </div>
  );
}
