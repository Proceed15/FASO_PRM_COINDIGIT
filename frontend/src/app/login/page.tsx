/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../contexts/UserContext";
import userService from "@/services/userService";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);//pra ir direto no header

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

        console.log("Token decodificado:", decoded);

        if (decoded) {
          const user = {
            id: decoded.sub || decoded.nameid || decoded.NameIdentifier || null,
            name: decoded.unique_name || decoded.Name || decoded.name || "",
            email: decoded.email || "",
          };
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          router.push("/users");
        }
      } else {
        setError("Token inválido recebido.");
      }
    } catch (error) {
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="bg-[url('/images/BACKGROUND-LOSANGOS.png')] flex flex-col justify-center items-center md:flex-row min-h-screen text-white">
      {/* Lado direito */}
      <div className="rounded-xl shadow-lg flex flex-col justify-center items-center h-[500px] md:w-1/2 bg-[#171e33] p-8">
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-3xl font-mono font-bold text-center">LOGIN</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-mono mb-1">Usuário</label>
              <input
                type="text"
                name="email"
                placeholder="E-mail"
                className="w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-mono mb-">Senha</label>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className="mb-4 w-full px-4 py-2 bg-[#0c0c1a] border border-[#2c2c3f] rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full h-[40px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150 rounded-lg"
            >
              Login
            </button>

            <button
              type="button"
              className="w-full h-[40px] bg-tranparent border hover:active:scale-95 transition-transform duration-150 rounded-lg"
              onClick={() => router.push("/register")}
            >
              Crie sua conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
