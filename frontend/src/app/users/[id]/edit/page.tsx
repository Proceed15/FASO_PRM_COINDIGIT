"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import Header from "../../../../components/common/Header";
import userService, { User } from "../../../../services/userService";
import { UserContext } from "../../../../contexts/UserContext";

interface UserEditPageProps {
    params: {
        id: string;
    };
}

export default function UserEditPage({ params }: UserEditPageProps) {
    const router = useRouter();
    const userId = params.id;
    const { user: loggedInUser } = useContext(UserContext);

    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        photo: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            setError("");
            try {
                const data = await userService.getById(parseInt(userId));
                if (data) {
                    setUser(data);
                    setFormData({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        photo: data.photo,
                        password: "",
                        confirmPassword: "",
                    });
                } else {
                    setUser(null);
                    setError("Usuário não encontrado");
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (!user) {
            setError("Usuário não carregado");
            return;
        }

        try {
            const updatedUser: User = {
                id: user.id,
                name: formData.name || "",
                email: formData.email || "",
                phone: formData.phone || "",
                address: formData.address || "",
                password: formData.password && formData.password.trim() !== "" ? formData.password : "",
                photo: user.photo || "",
            };
            // Call API to update user
            await userService.update(user.id!, updatedUser);
            if (loggedInUser && loggedInUser.id) {
                router.push(`/users/${loggedInUser.id}/view`);
            } else {
                router.push(`/users/${userId}/view`);
            }
        } catch (error: any) {
            console.error("Erro ao atualizar usuário:", error);
            setError(`Erro ao atualizar usuário: ${error.message || error}`);
        }
    };

    const handleDelete = async () => {
        setError("");
        if (!user) {
            setError("Usuário não carregado");
            return;
        }
        try {
            await userService.delete(user.id!);
            router.push("/users");
        } catch (error) {
            setError(`Erro ao deletar usuário: ${error}`);
        }
    };

    if (loading) {
        return (
            <>
                <Header pageName="Usuários" />
                <div className="p-6 max-w-4xl mx-auto">Carregando usuário...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header pageName="Usuários" />
                <div className="p-6 max-w-4xl mx-auto text-red-600">{error}</div>
                <Button variant="outline" onClick={() => router.push("/users")}>
                    Voltar
                </Button>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header pageName="Usuários" />
                <div className="p-6 max-w-4xl mx-auto text-red-600">Usuário não encontrado</div>
                <Button variant="outline" onClick={() => router.push("/users")}>
                    Voltar
                </Button>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e]">
            <Header pageName="Usuários" />
            <div className="p-6 space-y-6 max-w-4xl mx-auto pt-[100px] pb-[50px]">
                <h1 className="text-2xl font-bold text-white">Editar Usuário</h1>

                <form onSubmit={handleSubmit} className="space-y-4 bg-[#1e1e3f] border border-purple-200 rounded-lg shadow-sm p-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Endereço"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="photo"
                        placeholder="Foto (URL)"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.photo}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Senha"
                        className="w-full bg-transparent border border-purple-300 rounded px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <div className="flex justify-between items-center pt-4">
                        <Button
                            type="button"
                            className="border border-red-300 bg-red-600 hover:bg-red-700 text-white hover:opacity-90 active:scale-95 transition font-semibold rounded px-4 py-2"
                            onClick={handleDelete}
                        >
                            Deletar
                        </Button>
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                className="border border-purple-200 bg-transparent text-white hover:bg-purple-800 hover:opacity-90 active:scale-95 transition font-semibold rounded px-4 py-2"
                                onClick={() => router.push(`/users`)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition font-semibold rounded px-4 py-2"
                            >
                                Salvar & Atualizar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
