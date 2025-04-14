import React, { createContext, useContext, useState, useEffect } from "react";
import { Storage } from "../storage/Storage";

interface AuthContextType {
  isLogged: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Cargar el token al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await Storage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          setIsLogged(true);
        } else {
          setToken(null);
          setIsLogged(false);
        }
      } catch (error) {
        console.error("AuthContext - Error loading token:", error);
        setToken(null);
        setIsLogged(false);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await Storage.setItem("authToken", newToken);
      setToken(newToken);
      setIsLogged(true);
    } catch (error) {
      console.error("AuthContext - Error saving token:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Storage.deleteItem("authToken");
      setToken(null);
      setIsLogged(false);
    } catch (error) {
      console.error("AuthContext - Error removing token:", error);
      throw error;
    }
  };

  const contextValue = React.useMemo(
    () => ({ isLogged, token, login, logout }),
    [isLogged, token, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
