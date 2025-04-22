/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function LoginPage() {
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

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-mono mb-1">Usuário</label>
                            <input
                                type="text"
                                placeholder="Usuário"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-1">Senha</label>
                            <input
                                type="password"
                                placeholder="Senha"
                                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                    </div>

                    <button className="w-full py-2 bg-purple-700 hover:bg-[#300052] rounded text-white font-mono">
                        Login
                    </button>

                    <button className="w-full py-2 border border-white hover:bg-white hover:text-black rounded font-mono transition-colors duration-300">
                        Crie sua conta
                    </button>
                </div>
            </div>
        </div>
    );
}
