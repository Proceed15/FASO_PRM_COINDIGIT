"use client";

import { useState, useEffect, useContext } from "react";
import { UserPlus, ArrowLeft, Trash2, PlusCircle, HandCoins } from "lucide-react";
import AddItemForm from "./AddItemForm";
import TransferForm from "./TransferForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import walletService from "../../../services/walletService";
import { UserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import TransferToUserForm from "./TransferToUserForm";

interface WalletDetailsProps {
  wallet: any;
  onBack: () => void;
  refreshWallet: () => Promise<void>;
}

export default function WalletDetails({ wallet, onBack, refreshWallet }: WalletDetailsProps) {
  const { user } = useContext(UserContext);
  const [showTransferUser, setShowTransferUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(wallet.items || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);

  useEffect(() => {
    setItems(wallet.items || []);
  }, [wallet]);

  const removeItem = async (symbol: string) => {
    try {
      setLoading(true);
      await walletService.deleteItem(Number(user?.id), wallet.walletId, symbol);
      await refreshWallet();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 w-full gap-4">
        <div className="border border-white/80 rounded-lg w-full md:w-[450px] flex justify-center items-center p-2">
          <h2 className="text-3xl font-bold text-center">
            Carteira: {wallet.walletId.substring(0, 8)}
          </h2>
        </div>
        <div className="flex justify-center md:justify-end items-center w-full md:w-auto">
          <h2 className="text-yellow-300 text-3xl font-bold">
            Total: <span>${wallet.totalUsd?.toFixed(2)}</span>
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="border-2 border-[#fffcb7] rounded-lg overflow-x-auto mt-6">
        <table className="min-w-[600px] w-full text-white bg-[#171e33]">
          <thead className="bg-[#11172b] text-[#fffcb7]">
            <tr>
              <th className="text-left border-r px-4 py-3">Moeda</th>
              <th className="text-right border-r px-4 py-3">Quantidade</th>
              <th className="text-right border-r px-4 py-3">Preço USD</th>
              <th className="text-right border-r px-4 py-3">Total USD</th>
              <th className="text-center border-r px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Nenhum item nesta carteira.
                </td>
              </tr>
            ) : (
              items.map((item: any) => (
                <tr key={item.symbol} className="hover:bg-[#11172b] transition">
                  <td className="px-4 py-2 border-r border-t border-[#fffcb7]">{item.symbol}</td>
                  <td className="text-right px-4 py-2 border-r border-t border-[#fffcb7]">{item.amount}</td>
                  <td className="text-right px-4 py-2 border-r border-t border-[#fffcb7]">${item.lastPriceUsd}</td>
                  <td className="text-right px-4 py-2 border-r border-t border-[#fffcb7]">${item.totalUsd}</td>
                  <td className="text-center px-4 py-2 border-r border-t border-[#fffcb7]">
                    <button
                      onClick={() => setConfirmDelete(item.symbol)}
                      disabled={loading}
                      className="p-2"
                    >
                      <Trash2 size={18} className="text-red-400 hover:text-red-200" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-4 mt-8 mb-8 justify-center md:justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-400 px-5 py-3 rounded-xl flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft size={22} /> Voltar
        </Button>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-400 px-5 py-3 rounded-xl text-white flex items-center gap-2"
        >
          <PlusCircle size={23} /> Adicionar Moeda
        </button>

        <button
          onClick={() => setShowTransfer(true)}
          className="bg-orange-500 hover:bg-orange-400 px-5 py-3 rounded-xl text-white flex items-center gap-2"
        >
          <HandCoins size={23} /> Transferir para carteira
        </button>
        <button
          onClick={() => setShowTransferUser(true)}
          className="bg-purple-500 hover:bg-purple-400 px-5 py-3 rounded-xl text-white flex items-center gap-2"
        >
          <UserPlus size={23} /> Transferir para usuário
        </button>

      </div>

      {/* MODAL ADD */}
      {showAddForm && (
        <AddItemForm
          walletId={wallet.walletId}
          walletItems={items}
          onClose={() => setShowAddForm(false)}
          onSuccess={(updatedItems) => setItems(updatedItems)}
        />
      )}

      {/* Novo modal para transferir para outro usuário */}
      {showTransferUser && (
        <TransferToUserForm
          walletId={wallet.walletId}
          onClose={() => setShowTransferUser(false)}
          onSuccess={async () => await refreshWallet()}
        />
      )}

      {/* MODAL TRANSFER */}
      {showTransfer && (
        <TransferForm
          walletId={wallet.walletId}
          onClose={() => setShowTransfer(false)}
          onSuccess={async () => {
            await refreshWallet();
          }}
        />
      )}

      {/* MODAL DELETE */}
      {confirmDelete && (
        <DeleteConfirmModal
          symbol={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            await removeItem(confirmDelete);
            setConfirmDelete(null);
          }}
        />
      )}
    </div>
  );
}
