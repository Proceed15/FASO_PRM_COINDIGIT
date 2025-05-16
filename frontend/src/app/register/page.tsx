/* eslint-disable @next/next/no-img-element */
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
        } catch (error) {
            setError(`Erro ao registrar usuário: ${error}`);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen text-white">
            {/* Lado esquerdo */}
            <div
                className="flex items-center justify-center md:w-1/2 bg-gradient-to-br from-[#1e1e3f] to-[#2c2c54] p-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e1e3f] via-[#2c2c54] to-[#1e1e3f] opacity-70 z-10 animate-gradientMove bg-[length:400%_400%]" />
                <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-50 z-0" />
                <div className="flex items-center gap-6 relative z-10">
                    <img
                        src="/images/Logo_CoinDigit.png"
                        alt="Logo Coindigit"
                        className="w-32 h-32"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-5xl font-mono font-bold tracking-[0.3em]">
                            COINDIGIT
                        </h1>
                        <p className="text-2xl font-light">Cripto e Trading</p>
                    </div>
                </div>
            </div>

            {/* Lado direito */}
            <div className="flex flex-col justify-center items-center md:w-1/2 bg-gradient-to-b from-[#443e60] to-[#060c39] p-8 border border-white-500">
                <div className="w-full max-w-sm space-y-6">
                    <h2 className="text-3xl font-mono font-bold text-center">CADASTRO</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-mono mb-1">Nome de usuário</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Digite seu nome de usuário"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                className=" mb-6 w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* button*/}
                        <button
                            type="submit"
                            className="w-full py-2 bg-purple-700 hover:bg-[#300052] rounded text-white font-mono"
                        >
                            Criar Conta
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm">
                            Já tem uma conta?{" "}
                            <button className="w-full py-2 bg-purple-100 hover:bg-[#300052] rounded text-white font-mono"
                            onClick={() => router.push("/login")}>
                            <a href="/" className="text-purple-500 hover:underline"
                            >
                                Faça login
                            </a>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
