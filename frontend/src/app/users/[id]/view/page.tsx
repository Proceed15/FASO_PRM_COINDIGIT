"use client"

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

interface UserViewpageProps {
    params: { 
        id :string, 
        name: string, 
        email: string, 
        phone: string, 
        address: string, 
        password: string 
    };
}
export default function UserViewPage({ params }: UserViewpageProps) {
    const router = useRouter();
    const userId = params.id;

    const user = params;

    if (!user) return notFound();

    return (
        <>
            <Header pageName="Usuários" />
            <p>p</p>
            <p>p</p>
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