"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  isInitialized: boolean;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  isInitialized: false,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeUser = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Verificar se há um usuário armazenado
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao parsear usuário armazenado:", error);
          // Limpar dados corrompidos
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Erro ao inicializar usuário:", error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await initializeUser();
  }, [initializeUser]);

  const setUserWithStorage = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserWithStorage, 
      isLoading, 
      isInitialized,
      refreshUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};
