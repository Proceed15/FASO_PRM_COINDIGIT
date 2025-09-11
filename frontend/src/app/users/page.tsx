"use client";

import { useRouter } from "next/navigation";
import userService, { User } from "../../services/userService";
import Header from "../../components/common/Header";
import { Button } from "../../components/ui/button";
import { DeleteUserDialog } from "../../components/dialogs/DeleteUserDialog";
import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

export default function UserListPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const pageSize = 7;

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (column: keyof User) => {
    if (sortColumn !== column) {
      return (
        <span className="text-[#3fadc0] opacity-50">
          <ChevronUp size={14} className="-mb-1" />
          <ChevronDown size={14} className="-mt-1" />
        </span>
      );
    }

    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="min-h-screen items-center justify-start bg-[#283976] text-white">
      <Header pageName="Lista de Usuários" />
      {error && <div className="text-red-500 my-4">{error}</div>}
      <div className="mt-[20px] flex flex-col items-center justify-start">
        <div className="mb-[40px] mt-[40px] w-full max-w-6xl px-4">

          {/* PESQUISA + ADD */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-left mb-[20px] w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar usuário..."
              className="bg-[#11172b] border border-[#00d9ff] text-white rounded-lg px-3 py-2 w-full sm:max-w-md outline-none"
            />
            <Button
              className="bg-[#3fadc0] hover:bg-cyan-600 text-white font-semibold rounded px-4 py-2 active:scale-95 transition-transform duration-150"
              onClick={() => router.push("/register")}
            >
              Adicionar Usuário
            </Button>
          </div>

          {/* TABELA */}
          <div className="border-2 border-[#00d9ff] rounded-lg overflow-x-auto">
            <table className="min-w-[600px] w-full text-white bg-[#171e33]">
              <thead className="bg-[#11172b] text-[#3fadc0]">
                <tr>
                  <th onClick={() => handleSort("name")} className="text-left px-4 py-3 border-r border-[#00d9ff] cursor-pointer select-none">
                    <div className="flex items-center gap-1">Nome {renderSortIcon("name")}</div>
                  </th>
                  <th onClick={() => handleSort("email")} className="text-right px-4 py-3 border-r border-[#00d9ff] cursor-pointer select-none">
                    <div className="flex justify-end items-center gap-1">Email {renderSortIcon("email")}</div>
                  </th>
                  <th onClick={() => handleSort("phone")} className="text-right px-4 py-3 border-r border-[#00d9ff] cursor-pointer select-none">
                    <div className="flex justify-end items-center gap-1">Telefone {renderSortIcon("phone")}</div>
                  </th>
                  <th onClick={() => handleSort("address")} className="text-right px-4 py-3 border-r border-[#00d9ff] cursor-pointer select-none">
                    <div className="flex justify-end items-center gap-1">Endereço {renderSortIcon("address")}</div>
                  </th>
                  <th className="text-center px-4 py-3 border-[#00d9ff]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#11172b] transition">
                    <td className="px-4 py-2 border-t border-r border-[#00d9ff]">{user.name}</td>
                    <td className="text-right px-4 py-2 border-t border-r border-[#00d9ff]">{user.email}</td>
                    <td className="text-right px-4 py-2 border-t border-r border-[#00d9ff]">{user.phone}</td>
                    <td className="text-right px-4 py-2 border-t border-r border-[#00d9ff]">{user.address}</td>
                    <td className="text-center px-4 py-2 border-t border-[#00d9ff]">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <button className="p-2" onClick={() => router.push(`/users/${user.id}/view`)}>
                          <Eye size={22} className="text-cyan-400 hover:text-cyan-200" />
                        </button>
                        <button className="p-2" onClick={() => router.push(`/users/${user.id}/edit`)}>
                          <Pencil size={20} className="text-yellow-400 hover:text-yellow-200" />
                        </button>
                        <DeleteUserDialog
                          userId={String(user.id)}
                          userName={user.name}
                          onDelete={handleDelete}
                          icon={<Trash2 size={20} className="text-red-500 hover:text-red-300" />}
                          className="p-2"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="mt-[20px] mb-[20px] flex flex-wrap justify-end items-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded hover:text-cyan-600 disabled:opacity-40 text-sm sm:text-base flex items-center justify-center">
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${currentPage === i + 1
                  ? "bg-[#3fadc0] text-white"
                  : "hover:bg-cyan-600"}`}>
                {i + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded hover:text-cyan-600 disabled:opacity-40 text-sm sm:text-base flex items-center justify-center">
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
