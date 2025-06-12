import axios from "axios";

export interface Currency {
  id?: number;
  name: string;
  description: string;
  backing: string;
  status: string;
}

const BASE_URL = "http://localhost:5120/api/Currency";

const currencyService = {
  async getAll(): Promise<Currency[]> {
    const token = localStorage.getItem("token");
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getById(id: number): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async create(currency: Currency): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.post(BASE_URL, currency, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async update(id: number, currency: Currency): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}/${id}`, currency, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default currencyService;
