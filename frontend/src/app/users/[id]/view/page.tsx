"use client"

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";

interface UserViewpageProps {
    params: { 
        id : string;
    };
}

export default function UserViewPage({ params }: UserViewpageProps) {
    const router = useRouter();
    const userId = params.id;

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLoggedUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            setError("");
            try {
                const data = await userService.getById(parseInt(userId));
                if (data) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setError(`Erro ao buscar usuário: ${error}`);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <>
                <Header pageName="Usuários" userName={loggedUser?.name} userId={loggedUser?.id} />
                <div className="p-6 max-w-4xl mx-auto">Carregando usuário...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header pageName="Usuários" userName={loggedUser?.name} userId={loggedUser?.id} />
                <div className="p-6 max-w-4xl mx-auto text-red-600">{error}</div>
                <Button variant="outline" onClick={() => router.push("/users")}>
                    Voltar
                </Button>
            </>
        );
    }

    if (!user) return notFound();

    return (
        <>
            <Header pageName="Usuários" userName={loggedUser?.name} userId={loggedUser?.id} />
            <p>User</p>
            <p>A</p>
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold">Perfil</h1>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="text-lg font-medium text-gray-800">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-lg font-medium text-gray-800">{user.email}</p>              
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="text-lg font-medium text-gray-800">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Endereço</p>
                        <p className="text-lg font-medium text-gray-800">{user.address}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Senha</p>
                        <p className="text-lg font-medium text-gray-800">{user.password}</p>
                    </div>                    
                </div>

            {/* Botões Voltar e Editar */}
            <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => router.push(`/users/${userId}/edit`)}>
                    Editar
                </Button>
                <Button variant="outline" onClick={() => router.push("/users")}>
                    Voltar
                </Button>
            </div>
            </div>
        </>
    );
}
