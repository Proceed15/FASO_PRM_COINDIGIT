"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import userService, { User } from "@/services/userService";

interface UserEditPageProps {
    params: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        password: string;
    };
    User: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        password: string;
    }
}

export default function UserEditPage({ params }: UserEditPageProps) {
    const router = useRouter();
    
    const userId = params.id;

    const [User, setUsers] = useState({
        name: params.name,
        email: params.email,
        phone: params.phone,
        address: params.address,
        password: params.password,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar dados para a API
        console.log("Atualizando Usuário: ", User);
        router.push(`/users/${userId}/view`);
    };

    return (
        <>
        <p>p</p>
        <p>p</p>
        <Header pageName="Usuários" />
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font bold">
                Editar Usuário:
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Nome"
                className="w-full border rounded px-4 py-2"
                value={User.name}
                onChange={(e) => setUsers({...User, name: e.target.value})}
                /> 
                <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
                value={User.email}
                onChange={(e) => setUsers({...User, email: e.target.value})}
                />
                <input
                type="text"
                placeholder="Telefone"
                className="w-full border rounded px-4 py-2"
                value={User.phone}
                onChange={(e) => setUsers({...User, phone: e.target.value})}
                />
                <input
                type="text"
                placeholder="Endereço"
                className="w-full border rounded px-4 py-2"
                value={User.address}
                onChange={(e) => setUsers({...User, address: e.target.value})}
                />
                <input
                type="text"
                placeholder="Senha"
                className="w-full border rounded px-4 py-2"
                value={User.password}
                onChange={(e) => setUsers({...User, password: e.target.value})}
                />
                <input
                type="text"
                placeholder="Confirmar Senha"
                className="w-full border rounded px-4 py-2"
                value={User.password}
                onChange={(e) => setUsers({...User, password: e.target.value})}
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