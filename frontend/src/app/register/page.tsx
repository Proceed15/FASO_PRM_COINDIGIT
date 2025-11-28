"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import userService, { User } from "@/services/userService";

export default function RegisterPage() {
    const router = useRouter();

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

        try {
            const newUser: User = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                photo: formData.photo,
                password: formData.password,
            };
            await userService.register(newUser);
            router.push("/login");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError(`Erro ao registrar usuário: ${error}`);
            }
        }
    };

    return (
        <div className="bg-[url('/images/BACKGROUND-LOSANGOS.png')] flex flex-col justify-center items-center md:flex-row min-h-screen text-white">
            {/* Lado direito */}
            <div className="mt-[30px] mb-[30px] rounded-xl shadow-lg flex flex-col justify-center items-center md:w-1/2 bg-[#171e33] p-8 border border-white-500">
                <div className="w-full max-w-sm space-y-6">
                    <h2 className="text-3xl font-mono font-bold text-center">CADASTRO</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-mono mb-1">Nome de usuário</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Digite seu nome de usuário"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Digite seu e-mail"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Telefone</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Digite seu Telefone"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Endereço</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Digite seu Endereço"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Foto</label>
                            <input
                                type="text"
                                name="photo"
                                placeholder="Escolha sua foto"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.photo}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Senha</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Confirmar Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirme sua senha"
                                className="mb-2 w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full h-[40px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150 rounded-lg"
                        >
                            Criar Conta
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm">
                            <button className="w-full h-[40px] bg-tranparent border hover:active:scale-95 transition-transform duration-150 rounded-lg"
                            onClick={() => router.push("/login")}>
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
