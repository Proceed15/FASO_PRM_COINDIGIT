/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";

function parseJwt (token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await userService.login(formData.email, formData.password);
            const token = response.token || response.Token || response;
            if (token) {
                localStorage.setItem("token", token);
                const decoded = parseJwt(token);
                if (decoded) {
                    const user = {
                        id: decoded.nameid || decoded.NameIdentifier || null,
                        name: decoded.unique_name || decoded.Name || decoded.name || "",
                        email: decoded.email || ""
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                }
                router.push("/users");
            } else {
                setError("Token inválido recebido.");
            }
        } catch (error) {
            setError("Falha no login. Verifique suas credenciais.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen text-white">
            {/* Lado esquerdo*/}
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
                    <h2 className="text-3xl font-mono font-bold text-center">LOGIN</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-mono mb-1">Usuário</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Usuário"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Senha</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-2 bg-purple-700 hover:bg-[#300052] rounded text-white font-mono"
                        >
                            Login
                        </button>

                        <button className="w-full py-2 border border-white hover:bg-white hover:text-black rounded font-mono transition-colors duration-300"
                        onClick={() => router.push("/register")}>
                            Crie sua conta
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
