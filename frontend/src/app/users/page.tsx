"use client";

import { useRouter } from "next/navigation";
import userService, { User } from "../../services/userService";
import Header from '../../components/common/Header';
import { Button } from "../../components/ui/button";
import { DeleteUserDialog } from "../../components/dialogs/DeleteUserDialog";
import { useEffect, useState } from "react";

export default function UserListPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<String>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        setError(`Erro ao buscar usuários ${error}`);
      }
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await userService.delete(Number(id));
      setUsers((prev) => prev.filter((user) => user.id !== Number(id)));
    } catch (error) {
      setError(`Erro ao deletar usuário: ${error}`);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#0c0f3a] to-[#2a184e] text-white p-8 pt-[100px]">
      <Header pageName="Lista de Usuários" />
      {error && <div className="text-red-500 my-4">{error}</div>}

      <div className="w-full max-w-6xl bg-[#1e1e3f] border border-white-500 rounded-xl p-6 shadow-lg">
        <div className="flex justify-left items-center mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar usuário..."
            className="bg-[#0e0e2f] border border-white-400 text-white rounded-lg px-4 py-2 w-full max-w-md outline-none"
          />
          <Button
            className="ml-4 border border-white-400 bg-tranparent text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
            onClick={() => router.push("/register")}
          >
            Adicionar Usuário
          </Button>
        </div>

        <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
          <table className="w-full text-white bg-[#0e0e2f]">
            <thead className="bg-[#2a184e] text-purple-300">
              <tr>
                <th className="text-left px-4 py-3 border-r border-purple-500">Nome</th>
                <th className="text-left px-4 py-3 border-r border-purple-500">Email</th>
                <th className="text-left px-4 py-3 border-r border-purple-500">Telefone</th>
                <th className="text-left px-4 py-3 border-r border-purple-500">Endereço</th>
                <th className="text-left px-4 py-3 border-r border-purple-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#2a184e] transition">
                  <td className="px-4 py-2 border-t border-r border-purple-400">{user.name}</td>
                  <td className="px-4 py-2 border-t border-r border-purple-400">{user.email}</td>
                  <td className="px-4 py-2 border-t border-r border-purple-400">{user.phone}</td>
                  <td className="px-4 py-2 border-t border-r border-purple-400">{user.address}</td>
                  <td className="px-4 py-2 border-t border-r border-purple-400 space-x-2">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900 hover:text-white"
                      onClick={() => router.push(`/users/${user.id}/view`)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      className="border-yellow-500 text-yellow-400 hover:bg-yellow-900 hover:text-white"
                      onClick={() => router.push(`/users/${user.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <DeleteUserDialog
                      userId={String(user.id)}
                      userName={user.name}
                      onDelete={handleDelete}
                      className="border-red-600 text-red-500 hover:bg-red-900 hover:text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="border border-white-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
          >
            Anterior
          </button>
          <button
            className="ml-4 border border-purple-200 bg-purple-700 text-white hover:bg-[#52008b] hover:opacity-90 active:scale-95 transition transform text-white font-semibold rounded px-4 py-2"
          >
            Próximo
          </button>
        </div>


      </div>
    </div>
  );
}
