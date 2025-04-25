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
  const filteredUsers = users.filter((user) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseName = user.name.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen text-white flex justify-center bg-gradient-to-b from-[#443e60] to-[#060c39] p-8">
      <Header pageName="Usuários" />
      {error && <div className="p-6 max-w-4xl mx-auto text-red-600">{error}</div>} 
      <div className="flex flex-col justify-start items-center w-full max-w-7xl border border-white-500 overflow-auto bg-[#1e1e3f] rounded-lg p-2">
      <p>User A1</p>    
        <div className="space-y-6 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lista de Usuários</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/register")}
            >
              Adicionar Usuário
            </Button>
          </div>

          <div className="flex justify-end mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar usuário..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm text-black"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-lg bg-white border rounded-lg text-black border-l-4 border-r-8 border-gray-400">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Nome</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Telefone</th>
                  <th className="text-left px-4 py-2">Endereço</th>
                  <th className="text-left px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.address}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-transparent"
                        onClick={() => router.push(`/users/${user.id}/view`)}
                      >
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-transparent"
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                      >
                        Editar
                      </Button>
                      <DeleteUserDialog
                        userId={String(user.id)}
                        userName={user.name}
                        onDelete={handleDelete}
                        className="border-red-600 text-red-600 hover:bg-transparent"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-end pt-4">
            <nav className="space-x-2">
              <button className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-300">
                Anterior
              </button>
              <button className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-300">
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

