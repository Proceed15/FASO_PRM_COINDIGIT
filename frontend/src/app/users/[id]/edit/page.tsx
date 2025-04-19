"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";

interface UserEditPageProps {
    params: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        password: string;
    };
}

export default function UserEditPage({ params }: UserEditPageProps) {
    const router = useRouter();
    const userId = params.id;

    const [user, setUsers] = useState({
        id: userId,
        name: params.name,
        email: params.email,
        phone: params.phone,
        address: params.address,
        password: params.password,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar dados para a API
        console.log("Atualizando Usuário: ", user);
        router.push(`/users/${userId}/view´`);
    };

    return (
        <>
        <p>p</p>
        <Header pageName="Usuários" />
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="p-6 space-y-6 max-w-4xl mx-auto">
                Editar Usuário:
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Nome"
                className="w-full border rounded px-4 py-2"
                value={user.name}
                onChange={(e) => setUsers({...user, name: e.target.value})}
                /> 
                <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
                value={user.email}
                onChange={(e) => setUsers({...user, email: e.target.value})}
                />
                <input
                type="text"
                placeholder="Telefone"
                className="w-full border rounded px-4 py-2"
                value={user.phone}
                onChange={(e) => setUsers({...user, phone: e.target.value})}
                />
                <input
                type="text"
                placeholder="Endereço"
                className="w-full border rounded px-4 py-2"
                value={user.address}
                onChange={(e) => setUsers({...user, address: e.target.value})}
                />
                <input
                type="text"
                placeholder="Senha"
                className="w-full border rounded px-4 py-2"
                value={user.password}
                onChange={(e) => setUsers({...user, password: e.target.value})}
                />
                <input
                type="text"
                placeholder="Confirmar Senha"
                className="w-full border rounded px-4 py-2"
                value={user.password}
                onChange={(e) => setUsers({...user, password: e.target.value})}
                />

                <div className="flex justify-end space-x-2">
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/users`)}
                    >
                    Cancelar
                    </Button>
                    <Button type="submit" variant="outline">
                    Salvar & Atualizar
                    </Button>
                </div>
            </form>
        </div>
        </>
    );
}