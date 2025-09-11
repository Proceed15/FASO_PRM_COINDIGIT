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
    <div className="min-h-screen bg-[#283976]">
      <Header pageName="Usuários" userName={user.name} userId={user.id} />
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="mb-[120px] w-full max-w-4xl bg-[#171e33] border border-transparent rounded-lg p-6 shadow-lg space-y-6 text-white">
          <div className="h-[150px] flex items-center justify-center">
            <img
              src={user.photo || "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg"}
              alt={user.name}
              className="w-28 h-28 rounded-full border-2 object-cover shadow-md"
            />
          </div>
          <p><span className="ml-5 font-semibold text-[#78ffef]">Nome:</span> {user.name}</p>
          <p><span className="ml-5 font-semibold text-[#78ffef]">Email:</span> {user.email}</p>
          <p><span className="ml-5 font-semibold text-[#78ffef]">Telefone:</span> {user.phone}</p>
          <p><span className="ml-5 font-semibold text-[#78ffef]">Endereço:</span> {user.address}</p>

          <div className="flex justify-end pt-4">
            <Button
              className="mx-2 w-[100px] bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/users")}
            >
              Voltar
            </Button>

            <Button
              className="mx-2 w-[100px] bg-[#265dbf] hover:bg-blue-800 active:scale-95 transition-transform duration-150"
              onClick={() => router.push(`/users/${userId}/edit`)}
            >
              Editar
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
