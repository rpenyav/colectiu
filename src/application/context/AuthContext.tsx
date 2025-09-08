// src/application/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthService } from "../../domain/services/AuthService";
import { HttpAuthRepository } from "../../domain/repositories/AuthRepository";

type SignInArgs = { username: string; password: string };

type Ctx = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean; // <- importante para Splash
  signIn: (args: SignInArgs) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

type Props = React.PropsWithChildren<{
  /** Base absoluta del servidor de seguridad (p.ej. http://demo.wad.cat:8440) */
  securityBaseUrl: string;
}>;

const STORAGE_KEY = "auth.token";

// Helpers de almacenamiento (web / nativo)
const webGetToken = (): string | null => {
  if (Platform.OS !== "web") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const webSetToken = (token: string) => {
  if (Platform.OS !== "web") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {}
};
const webClearToken = () => {
  if (Platform.OS !== "web") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

// JWT exp (opcional). Si no se puede decodificar, devolvemos null y no caducamos por cliente.
function tryGetJwtExp(token: string): number | null {
  try {
    if (!token || token.split(".").length !== 3) return null;
    const payloadPart = token.split(".")[1];
    // base64url → base64
    const b64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    // atob puede no existir en algunos entornos; lo intentamos:
    // @ts-ignore
    const json = typeof atob === "function" ? atob(b64) : null;
    if (!json) return null;
    const payload = JSON.parse(json);
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}
function isExpired(token: string | null): boolean {
  if (!token) return true;
  const exp = tryGetJwtExp(token);
  if (exp == null) return false; // no sabemos → no expiramos del lado cliente
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= exp;
}

export const AuthProvider: React.FC<Props> = ({
  securityBaseUrl,
  children,
}) => {
  if (!securityBaseUrl) {
    throw new Error("[AuthProvider] securityBaseUrl es obligatorio");
  }

  const service = useMemo(
    () => new AuthService(new HttpAuthRepository(), securityBaseUrl),
    [securityBaseUrl]
  );

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Rehidrata token guardado
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let t: string | null = null;
        if (Platform.OS === "web") {
          t = webGetToken();
        } else {
          t = (await SecureStore.getItemAsync(STORAGE_KEY)) ?? null;
        }
        if (t && !isExpired(t)) {
          if (!cancelled) setToken(t);
        } else if (t && isExpired(t)) {
          // limpiar si está expirado
          if (Platform.OS === "web") webClearToken();
          else await SecureStore.deleteItemAsync(STORAGE_KEY);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn: Ctx["signIn"] = async ({ username, password }) => {
    setLoading(true);
    try {
      const { token } = await service.signIn({ username, password });
      // si viene expirado (raro), no guardamos
      if (isExpired(token)) throw new Error("El token recibido está caducado");
      setToken(token);
      if (Platform.OS === "web") {
        webSetToken(token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEY, token);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setToken(null);
    if (Platform.OS === "web") webClearToken();
    else SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        hydrated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
