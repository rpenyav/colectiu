import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { User } from "../interfaces/User";
import { useUserService } from "../services/UserService";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  avatarUri: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const { fetchUserData, fetchUserAvatar } = useUserService();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const getUserIdFromToken = (token: string | null): number | null => {
    if (!token) {
      console.log("getUserIdFromToken - No token available");
      return null;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        console.log(
          "getUserIdFromToken - Invalid token format: Expected 3 parts"
        );
        return null;
      }

      const payloadBase64 = parts[1];

      const payloadString = atob(payloadBase64);

      const payload = JSON.parse(payloadString);

      const userId = payload?.userId || null;

      return userId;
    } catch (error) {
      console.error("Error al decodificar el token JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (token === lastToken) {
        console.log("UserProvider - Token has not changed, skipping load");
        return;
      }

      if (!token) {
        console.log("UserProvider - No token, clearing user data");
        if (isMounted) {
          setUser(null);
          setAvatarUri(null);
          setError(null);
          setLoading(false);
          setLastToken(null);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const userId = getUserIdFromToken(token);

        if (!userId) {
          throw new Error("No se pudo obtener el userId del token");
        }

        // Cargar los datos del usuario
        const userData = await fetchUserData();

        // Cargar el avatar
        const avatar = await fetchUserAvatar();

        if (isMounted) {
          setUser(userData);
          setAvatarUri(avatar);
          setLastToken(token);
          if (!userData) {
            setError("No se encontraron datos del usuario");
          }
        }
      } catch (err: any) {
        console.error(
          "UserProvider - Error:",
          err.message || "Error al cargar los datos del usuario"
        );
        if (isMounted) {
          setError(err.message || "Error al cargar los datos del usuario");
          setUser(null);
          setAvatarUri(null);
          setLastToken(token);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [token, fetchUserData, fetchUserAvatar]);

  const contextValue = React.useMemo(
    () => ({ user, loading, error, avatarUri }),
    [user, loading, error, avatarUri]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
