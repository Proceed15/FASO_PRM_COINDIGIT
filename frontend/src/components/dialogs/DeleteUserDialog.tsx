"use client";

import { useState, ReactNode } from "react";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  onDelete: (id: string) => void | Promise<void>;
  className?: string;
  icon?: ReactNode;
}

export function DeleteUserDialog({
  userId,
  userName,
  onDelete,
  className,
  icon,
}: DeleteUserDialogProps) {
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
              <p className="text-white ">
                Tem certeza que deseja excluir{" "}
                <strong>{userName}</strong>?
              </p>
            </div>
            <div className="mt-[20px] mb-[5px] h-[55px] flex justify-center items-center gap-6">
              <Button
                className="w-[100px] h-[40px] text-white bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
                variant="outline"
                onClick={() => setOpen(false)} >
                Cancelar
              </Button>
              <Button
                className="w-[100px] h-[40px] bg-red-600 hover:bg-red-700 text-white hover:opacity-90 active:scale-95 transition-transform duration-150"
                variant="danger"
                onClick={async () => {
                  await onDelete(userId);
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
