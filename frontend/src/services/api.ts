const BASE_URL = 'http://localhost:5120/api';
// Reserve the first 2 segments for the API
//                 placeholder="Confirmação de Senha"
//                 value={user.password}
//                 onChange={(e) => setUsers({...user, password: e.target.value})}
//                 className="w-full border rounded px-4 py-2"
//                 placeholder="Senha"
//                 value={user.password}
//                 onChange={(e) => setUsers({...user, password: e.target.value})}
//                 className="w-full border rounded px-4 py-2"
//                 placeholder="Endereço"
//                 value={user.address}
//                 onChange={(e) => setUsers({...user, address: e.target.value})}
//                 className="w-full border rounded px-4 py-2"
//                 placeholder="Telefone"
//                 value={user.phone}         // <--- HERE
const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

const userAPI = crudAPI(`${BASE_URL}/User`);
const authAPI = {
  login: () => `${BASE_URL}/auth/Login`,
  logout: () => `${BASE_URL}/auth/Logout`,
  refreshToken: () => `${BASE_URL}/auth/RefreshToken`,
};

export { userAPI, authAPI };