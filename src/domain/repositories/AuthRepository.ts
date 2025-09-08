// src/domain/repositories/AuthRepository.ts
import { endpoints } from "../../config/endpoints";

export type LoginBody = { username: string; password: string };
export type LoginApiResponse = {
  access_token?: string;
  authentication_token?: string;
  [k: string]: any;
};

export interface AuthRepository {
  login(serverSecurityBase: string, body: LoginBody): Promise<LoginApiResponse>;
}

export class HttpAuthRepository implements AuthRepository {
  async login(
    serverSecurityBase: string,
    body: LoginBody
  ): Promise<LoginApiResponse> {
    const url = endpoints.security.loginClient(serverSecurityBase);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // Intenta leer el cuerpo (puede venir vacío)
    const text = await res.text();
    let data: any = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }

    if (!res.ok) {
      const err: any = new Error(data?.message || "Login failed");
      err.status = res.status;
      err.raw = data || text || {};
      throw err;
    }

    // —— Extraer token desde CABECERAS ——
    const get = (k: string) =>
      res.headers.get(k) || res.headers.get(k.toLowerCase());
    const bearerish = (v?: string | null) =>
      v?.match(/Bearer\s+(.+)/i)?.[1] ?? v ?? null;

    const authz = get("Authorization") || get("Authentication");
    const xToken = get("X-Auth-Token") || get("x-auth-token");
    const accessHdr =
      get("access_token") || get("authentication_token") || xToken;

    const tokenFromHeaders = bearerish(authz) ?? bearerish(accessHdr) ?? null;

    // Si el cuerpo no trae token, lo inyectamos desde headers
    if (tokenFromHeaders) {
      if (!data.access_token && !data.authentication_token) {
        // Elige uno: authentication_token o access_token
        data.authentication_token = tokenFromHeaders;
        // o: data.access_token = tokenFromHeaders;
      }
    }

    return data as LoginApiResponse;
  }
}
