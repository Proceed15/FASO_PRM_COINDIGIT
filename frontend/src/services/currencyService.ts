import axios from "axios";

export interface Currency {
  id?: string;
  symbol: string;
  name: string;
  backing: string;
  reverse: boolean;
}

const BASE_URL = "http://localhost:5000/api/Currency";//PUSH GATEWAY

// PERFORMANCE
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const cache = new SimpleCache();

const axiosConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

const currencyService = {
  async getAll(): Promise<Currency[]> {
    const cacheKey = 'currencies_all';
    const cached = cache.get<Currency[]>(cacheKey);
    
    if (cached) {
      console.log('Retornando dados do cache:', cacheKey);
      return cached;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(BASE_URL, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });
      
      cache.set(cacheKey, response.data, 2 * 60 * 1000);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar moedas:', error);
      throw new Error('Falha ao carregar lista de moedas. Verifique sua conexão.');
    }
  },

  async getById(id: string): Promise<Currency> {
    const cacheKey = `currency_${id}`;
    const cached = cache.get<Currency>(cacheKey);
    
    if (cached) {
      console.log('Retornando dados do cache:', cacheKey);
      return cached;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/${id}`, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });

      const { histories, ...safeCurrency } = response.data;
      
      cache.set(cacheKey, safeCurrency, 5 * 60 * 1000);
      return safeCurrency;
    } catch (error) {
      console.error('Erro ao buscar moeda:', error);
      throw new Error('Falha ao carregar dados da moeda. Verifique sua conexão.');
    }
  },

  async create(currency: Currency): Promise<Currency> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(BASE_URL, currency, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });
      
      cache.delete('currencies_all');
      return response.data;
    } catch (error) {
      console.error('Erro ao criar moeda:', error);
      throw new Error('Falha ao criar moeda. Verifique os dados e tente novamente.');
    }
  },

  async update(id: string, currency: Currency): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/${id}`, currency, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });
      
      cache.delete('currencies_all');
      cache.delete(`currency_${id}`);
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error);
      throw new Error('Falha ao atualizar moeda. Verifique os dados e tente novamente.');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/${id}`, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });
      
      cache.delete('currencies_all');
      cache.delete(`currency_${id}`);
      cache.delete(`history_${id}`);
    } catch (error) {
      console.error('Erro ao deletar moeda:', error);
      throw new Error('Falha ao deletar moeda. Tente novamente.');
    }
  },

  async getHistory(id: string) {
    const cacheKey = `history_${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Retornando histórico do cache:', cacheKey);
      return cached;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/${id}/history`, {
        ...axiosConfig,
        headers: { 
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}` 
        },
      });
      
      cache.set(cacheKey, response.data, 1 * 60 * 1000);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Falha ao carregar histórico. Verifique sua conexão.');
    }
  },

  clearCache(): void {
    cache.clear();
    console.log('Cache limpo manualmente');
  },

  async healthCheck(): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${BASE_URL.replace('/Currency', '/health')}`, {
        timeout: 5000,
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch {
      return false;
    }
  }
};

export default currencyService;
