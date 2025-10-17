"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DeleteCurrencyDialogProps {
  currencyId: string;
  currencyName: string;
  onDelete: (id: string) => void;
  className?: string;
  icon?: ReactNode;  // ícone opcional para o botão
}

export function DeleteCurrencyDialog({
  currencyId,
  currencyName,
  onDelete,
  className = "",
  icon,
}: DeleteCurrencyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão de abrir diálogo */}
      <Button
        variant="outline"
        className={className || ""}
        onClick={() => setOpen(true)}
      >
        {icon}
      </Button>

      {/* Modal de confirmação */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="items-center justify-center border relative bg-[#283976] p-4 rounded-xl shadow-xl max-w-sm w-full z-50">
            <div className="mt-[10px] h-[55px] flex justify-center items-top gap-2">
              <h2 className="text-white font-bold text-lg">Confirmar Exclusão?</h2>
            </div>
            <div className="mt-[10px] text-center h-[55px] flex justify-center items-top gap-2">
              <p className="text-white">
                Tem certeza que deseja excluir <strong>{currencyName}</strong>?
              </p>
            </div>
            <div className="mt-[15x] mb-[5px] h-[55px] flex justify-center items-center gap-6">
              <Button
                className="w-[100px] h-[40px] text-white bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="w-[100px] h-[40px] bg-red-600 hover:bg-red-700 text-white hover:opacity-90 active:scale-95 transition-transform duration-150"
                variant="danger"
                onClick={async () => {
                  await onDelete(currencyId);
                  setOpen(false);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
