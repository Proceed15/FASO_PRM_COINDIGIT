"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userService, { User } from "@/services/userService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

export default function UserViewPage({ params }: Props) {
  const userId = params.id;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const data = await userService.getById(parseInt(userId));
        if (data) setUser(data);
        else setError("Usuário não encontrado");
      } catch {
        setError("Erro ao buscar usuário");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  if (loading) return <div className="text-white">Carregando...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!user) return <div className="text-white">Usuário não encontrado</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f3a] to-[#2a184e]">
      <Header pageName="Usuários" userName={user.name} userId={user.id} />
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-4xl bg-[#1e1e3f] border border-purple-300 rounded-lg p-6 shadow-lg space-y-6 text-white">
          <div className="flex justify-center">
            <img
              src={user.photo || "/images/default-avatar.png"}
              alt={user.name}
              className="mt-5 w-28 h-28 rounded-full border-2 border-purple-400 object-cover shadow-md"
            />
          </div>
          <p><span className="ml-5 font-semibold text-purple-300">Nome:</span> {user.name}</p>
          <p><span className="ml-5 font-semibold text-purple-300">Email:</span> {user.email}</p>
          <p><span className="ml-5 font-semibold text-purple-300">Telefone:</span> {user.phone}</p>
          <p><span className="ml-5 font-semibold text-purple-300">Endereço:</span> {user.address}</p>

          <div className="flex justify-end pt-4">
            <Button
              className="mx-2 w-[100px] bg-purple-700 hover:bg-purple-600"
              onClick={() => router.push(`/users/${userId}/edit`)}
            >
              Editar
            </Button>
            <Button
              className="mx-2 w-[100px] bg-blue-700 hover:bg-blue-600"
              onClick={() => router.push("/users")}
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
