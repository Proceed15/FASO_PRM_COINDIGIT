"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteConfirmModalProps {
    symbol: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({ symbol, onConfirm, onCancel }: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-500">
            <div className="bg-[#171e33] text-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md border border-[#fffcb7]">
                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-white text-lg font-semibold">
                        <span>Excluir Moeda</span>
                    </div>

                    {/* BOTÃO FECHAR */}
                    <button
                        onClick={onCancel}
                        className="text-white hover:text-red-500 transition"
                    >
                        <X size={26} />
                    </button>
                </div>

                {/* TEXTO */}
                <p className="text-lg text-gray-300 mb-6">
                    Tem certeza que deseja remover <span className="text-yellow-300">{symbol}</span>?
                </p>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="fw-full sm:w-auto border-2 border-transparent bg-red-500 flex items-center
            hover:bg-red-400 px-5 py-2 rounded-xl shadow-md active:scale-95 active:border-white 
            transition-transform duration-150 text-white font-semibold"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="fw-full sm:w-auto border-2 border-transparent bg-green-500 flex items-center
            hover:bg-green-400 px-5 py-2 rounded-xl shadow-md active:scale-95 active:border-white 
            transition-transform duration-150 text-white font-semibold"
                    >
                        Remover
                    </button>
                </div>
            </div>
        </div>
    );
}
