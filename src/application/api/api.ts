// src/infrastructure/api/api.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import Cookies from "js-cookie"; // solo en web
import { env } from "../../config/env";

export type HttpError = Error & {
  status?: number;
  code?: number | string;
  raw?: unknown;
};

const TOKEN_KEY = "access_token";

const baseHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// ----- Token management -----
async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return Cookies.get(TOKEN_KEY) ?? null;
  }
  try {
    return (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
  } catch {
    return null;
  }
}

// ----- Core fetch con timeout + abort + parse robusto -----
async function doFetch<T = unknown>(
  url: string,
  options: RequestInit,
  injectAuth: boolean,
  label = "Request",
  timeoutMs = 15_000
): Promise<T> {
  const headers: HeadersInit = {
    ...baseHeaders,
    ...(options.headers || {}),
  };

  if (injectAuth) {
    const token = await getToken();
    if (token) (headers as any).Authorization = `Bearer ${token}`;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers, signal: ctrl.signal });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      const err: HttpError = new Error(`${label} timeout after ${timeoutMs}ms`);
      err.code = "TIMEOUT";
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }

  // 204 / body vacío → null
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text().catch(() => "");

  // Error HTTP → construir HttpError legible
  if (!res.ok) {
    let payload: any = null;
    if (contentType.includes("application/json")) {
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = null;
      }
    } else {
      payload = text;
    }

    const message =
      (payload &&
      typeof payload === "object" &&
      ("message" in payload || "errorString" in payload)
        ? payload.message || payload.errorString
        : undefined) ||
      (typeof payload === "string" ? payload : "") ||
      `HTTP ${res.status}`;

    const err: HttpError = new Error(message);
    err.status = res.status;
    if (payload && typeof payload === "object" && payload.code !== undefined) {
      err.code = payload.code;
    }
    err.raw = payload ?? text;
    throw err;
  }

  // OK → parse
  if (!text) {
    // Permite que el caller tipifique como T | null si procede
    return null as unknown as T;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      // Backend mandó JSON inválido o content-type engañoso
      return text as unknown as T;
    }
  }

  // Texto / otros content-types
  return text as unknown as T;
}

/** Con auth (Bearer si existe token) */
export const fetchWithAuth = async <T = unknown>(
  path: string,
  options: RequestInit = {},
  label?: string
): Promise<T> => {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const url = `${base}${path}`;
  return doFetch<T>(url, options, true, label ?? `Auth ${path}`);
};

/** Sin auth */
export const fetchWithoutAuth = async <T = unknown>(
  path: string,
  options: RequestInit = {},
  label?: string
): Promise<T> => {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const url = `${base}${path}`;
  return doFetch<T>(url, options, false, label ?? `NoAuth ${path}`);
};
