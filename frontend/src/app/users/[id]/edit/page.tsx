"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import Header from "../../../../components/common/Header";
import userService, { User } from "../../../../services/userService";

interface UserEditPageProps {
    params: {
        id: string;
    };
}

export default function UserEditPage({ params }: UserEditPageProps) {
    const router = useRouter();
    const userId = params.id;

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
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                photo: user.photo,
            };
            if (formData.password.trim() !== "") {
                updatedUser.password = formData.password;
            }
            // Call API to update user
            await userService.update(user.id!, updatedUser);
            router.push(`/users/${userId}/view`);
        } catch (error) {
            setError(`Erro ao atualizar usuário: ${error}`);
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
        <>
            <Header pageName="Usuários" />
            <p>User</p>
            <p>A</p>
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold">Editar Usuário</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        className="w-full border rounded px-4 py-2"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border rounded px-4 py-2"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        className="w-full border rounded px-4 py-2"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Endereço"
                        className="w-full border rounded px-4 py-2"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="photo"
                        placeholder="Foto"
                        className="w-full border rounded px-4 py-2"
                        value={formData.photo}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="w-full border rounded px-4 py-2"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Senha"
                        className="w-full border rounded px-4 py-2"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <div className="flex justify-between space-x-2">
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDelete}
                        >
                            Deletar
                        </Button>
                        <div className="flex space-x-2">
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
                    </div>
                </form>
            </div>
        </>
    );
}
