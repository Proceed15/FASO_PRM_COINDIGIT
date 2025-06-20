import axios from "axios";

export interface Currency {
  id?: string;
  symbol: string;
  name: string;
  backing: string;
  reverse: boolean;
}

const BASE_URL = "http://localhost:5002/api/Currency";

const currencyService = {
  async getAll(): Promise<Currency[]> {
    const token = localStorage.getItem("token");
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  /*
  async getById(id: string): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },*/

  async getById(id: string): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { histories, ...safeCurrency } = response.data;
    return safeCurrency;
  },


  async create(currency: Currency): Promise<Currency> {
    const token = localStorage.getItem("token");
    const response = await axios.post(BASE_URL, currency, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async update(id: string, currency: Currency): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.put(`${BASE_URL}/${id}`, currency, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default currencyService;
