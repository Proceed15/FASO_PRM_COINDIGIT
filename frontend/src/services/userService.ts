export interface User {
    Id?: number;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
    Password?: string;
    Photo: string;
}

const fakeUser: User[] = [{
    Id: 1,
    Name: "NomeUser",
    Email: "User@gmail.com",
    Phone: "(15)981088787",
    Address: "Rua do usuário, 1",
    Password: "senhaHashed",
    Photo: "User.png"
}, {
    Id: 2,
    Name: "TesteUser",
    Email: "TesteUser@gmail.com",
    Phone: "(11)40028922",
    Address: "Rua do usuário, 2",
    Password: "senhaHashed",
    Photo: "User.png"
}]

const userService = {
    async getUsers(): Promise<User[]> {
        return fakeUser;
    }
}

export default userService;