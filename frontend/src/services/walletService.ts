import axios from "axios";

const BASE_URL = "http://localhost:5000/api/Wallet"; // Gateway

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const walletService = {
  async getUserWallets(userId: number) {
    const response = await axios.get(`${BASE_URL}/${userId}`, getAuthHeaders());
    return response.data;
  },

  async createWallet(userId: number) {
    const response = await axios.post(
      `${BASE_URL}/${userId}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  async getWalletDetails(userId: number, walletId: string) {
    const response = await axios.get(
      `${BASE_URL}/${userId}/${walletId}`,
      getAuthHeaders()
    );
    return response.data;
  },

  async addItem(userId: number, walletId: string, item: { symbol: string; amount: number }) {
    const response = await axios.post(
      `${BASE_URL}/${userId}/${walletId}/items`,
      item,
      getAuthHeaders()
    );
    return response.data;
  },

  async deleteItem(userId: number, walletId: string, symbol: string) {
    await axios.delete(
      `${BASE_URL}/${userId}/${walletId}/items/${symbol}`,
      getAuthHeaders()
    );
  },

  async transfer(data: {
    fromUserId: number;
    toUserId: number;
    fromWalletId: string;
    toWalletId: string;
    symbol: string;
    amount: number;
  }) {
    const response = await axios.post(
      `${BASE_URL}/transfer`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },
};

export default walletService;
