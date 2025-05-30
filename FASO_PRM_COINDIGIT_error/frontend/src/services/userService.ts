import axios from "axios";
import { userAPI, authAPI } from "./api";

export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    photo: string;
}

const userService = {
    async getAll(): Promise<User[]> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.get(userAPI.getAll(), header)
        return response.data;
    },
    async getById(id: number): Promise<User> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.get(userAPI.getById(id), header)
        return response.data;
    },
    async getByEmail(email: string): Promise<User> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.get(`${userAPI.getAll()}/email/${email}`, header)
        return response.data;
    },
    async update(id: number, user: User): Promise<User> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.put(userAPI.edit(id), user, header);
        return response.data;
    },
    async register(user: User): Promise<User> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.post(userAPI.create(), user, header);
        return response.data;
    },
    async login(email: string, password: string): Promise<any> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.post(authAPI.login(), { email, password }, header);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        await axios.delete(userAPI.delete(id), header);
    }
}

export default userService;
