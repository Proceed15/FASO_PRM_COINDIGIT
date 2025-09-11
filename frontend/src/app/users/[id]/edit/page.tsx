"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import Header from "../../../../components/common/Header";
import userService, { User } from "../../../../services/userService";
import { UserContext } from "../../../../contexts/UserContext";
import { DeleteUserDialog } from "../../../../components/dialogs/DeleteUserDialog";

interface UserEditPageProps {
    params: {
        id: string;
    };
}

export default function UserEditPage({ params }: UserEditPageProps) {
    const router = useRouter();
    const userId = params.id;
    const { user: loggedInUser, setUser } = useContext(UserContext);

    const [user, setUserData] = useState<User | null>(null);
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
                    setUserData(data);
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
                    setError("Usuário não encontrado");
                }
            } catch (error) {
                setError(`Erro ao buscar usuário: ${error}`);
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
                password:
                    formData.password && formData.password.trim() !== ""
                        ? formData.password
                        : "",
                photo: formData.photo || user.photo || "",
            };

            await userService.update(user.id!, updatedUser);

            // Atualiza contexto se o usuário editado for o logado
            if (loggedInUser && loggedInUser.id === user.id) {
                setUser(updatedUser);
            }

            router.push(`/users/${user.id}/view`);
        } catch (error: any) {
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

            // Se o usuário deletado for o logado, desloga e vai para login
            if (loggedInUser && loggedInUser.id === user.id) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                router.push("/login");
            } else {
                router.push("/users");
            }
        } catch (error) {
            setError(`Erro ao deletar usuário: ${error}`);
        }
    };

    if (loading) {
        return (
            <>
                <Header pageName="Usuários" />
                <div className="p-6 max-w-4xl mx-auto text-white">Carregando usuário...</div>
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
        <div className="min-h-screen bg-[#283976]">
            <Header pageName="Usuários" />
            <div className="max-w-4xl mx-auto pt-[70px] pb-[75px] px-6">
                <form onSubmit={handleSubmit} className="space-y-6 bg-[#171e33] rounded-lg shadow-lg p-6">
                    {/* Foto + nome no topo */}
                    <div className="h-[200px] flex flex-col items-center justify-center">
                        <img
                            src={formData.photo || "/images/default-avatar.png"}
                            alt={formData.name}
                            className="w-28 h-28 rounded-full border-2 object-cover shadow-md mb-4"
                        />
                        <h1 className="text-3xl font-bold text-white">{formData.name || "Usuário"}</h1>
                    </div>

                    {/* Campos de input */}
                    {["name", "email", "phone", "address", "photo", "password", "confirmPassword"].map((field) => {
                        const label = field === "name" ? "Nome" :
                            field === "email" ? "Email" :
                                field === "phone" ? "Telefone" :
                                    field === "address" ? "Endereço" :
                                        field === "photo" ? "Foto (URL)" :
                                            field === "password" ? "Senha" :
                                                "Confirmar Senha";
                        const type = field.includes("password") ? "password" : "text";
                        return (
                            <div key={field}>
                                <label className="block text-[#78ffef] font-semibold mb-1" htmlFor={field}>
                                    {label}
                                </label>
                                <input
                                    id={field}
                                    name={field}
                                    type={type}
                                    value={(formData as any)[field]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border border-[#00d9ff] bg-transparent text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder={label}
                                />
                            </div>
                        );
                    })}

                    {/* Botões */}
                    <div className="flex justify-between items-center pt-6">
                        <DeleteUserDialog
                            userId={String(user.id)}
                            userName={user.name}
                            onDelete={handleDelete}
                            icon={
                                <Button
                                    type="button"
                                    className="bg-red-600 hover:bg-red-700 text-white hover:opacity-90 active:scale-95 transition-transform duration-150"
                                >
                                    Deletar
                                </Button>
                            }
                        />

                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                className="mx-2 w-[100px] bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
                                onClick={() => router.push(`/users`)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="mx-2 w-[100px] bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
