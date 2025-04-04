import { userAPI } from "./api";
import axios from "axios";

export interface User {
    Id?: number;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
    Password?: string;
    Photo: string;
}

const userService = {
    async getAll(): Promise<User[]> {
        const header = {
            Headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }
        const response = await axios.get(userAPI.getAll(), header)
        return response.data;
    }
}

export default userService;