import axios from "axios";

const API = "http://localhost:5000/api"; // Gateway Ocelot

export const getWalletsByUser = async (userId: number) => {
  return axios.get(`${API}/wallet/${userId}`);
};

export const getWalletDetails = async (walletId: number) => {
  return axios.get(`${API}/wallet/details/${walletId}`);
};

export const createWallet = async (data: { userId: number; name: string }) => {
  return axios.post(`${API}/wallet/create`, data);
};

export const getWalletItems = async (walletId: number) => {
  return axios.get(`${API}/wallet/items/${walletId}`);
};

export const createWalletItem = async (data: {
  walletId: number;
  currencyId: number;
  quantity: number;
  purchasePrice: number;
  usdValue: number;
}) => {
  return axios.post(`${API}/wallet/items/create`, data);
};

export const deleteWalletItem = async (itemId: number) => {
  return axios.delete(`${API}/wallet/items/${itemId}`);
};

export const transferBetweenWallets = async (data: {
  walletFrom: number;
  walletTo: number;
  amount: number;
  fee: number;
  type: string;
}) => {
  return axios.post(`${API}/wallet/transaction/transfer`, data);
};
