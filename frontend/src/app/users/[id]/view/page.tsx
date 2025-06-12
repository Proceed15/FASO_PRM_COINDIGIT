"use client"

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";

interface UserViewpageProps {
    params: {
        id: string;
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
        <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e]">
            <Header pageName="Usuários" userName={loggedUser?.name} userId={loggedUser?.id} />
            <div className="pt-[100px] p-6 smt-10 space-y-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white">Perfil</h1>

                <div className="mb-3 bg-[#1e1e3f] border border-purple-200 rounded-lg shadow-sm p-6 space-y-4">
                    <div>
                        <p className="text-sm text-purple-200">Nome</p>
                        <p className="text-lg font-medium text-white">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-purple-200">Email</p>
                        <p className="text-lg font-medium text-white">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-purple-200">Telefone</p>
                        <p className="text-lg font-medium text-white">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-purple-200">Endereço</p>
                        <p className="text-lg font-medium text-white">{user.address}</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <Button
                        className="mr-2 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
                        variant="default"
                        onClick={() => router.push(`/users/${userId}/edit`)}
                    >
                        Editar
                    </Button>
                    <Button
                        className="ml-4 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
                        variant="default"
                        onClick={() => router.push("/users")}
                    >
                        Voltar
                    </Button>
                </div>
            </div>
        </div>
    );
}
