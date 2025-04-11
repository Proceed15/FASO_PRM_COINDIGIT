"use client"
import { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";
import Header from '../../components/common/Header';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<String>("");

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

    return (
        <div>
            <Header pageName="Página Inicial" ></Header>
            <div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-2 mt-8 text-center">
                    Lista de Usuários
                </h1>
            </div>
            <p>{error}</p>
            <div className="flex justify-center items-center p-6">
                <table className="table-auto w-full max-w-4xl border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Telefone</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Endereço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}
