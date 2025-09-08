// src/domain/repositories/ClientRepository.ts
import { env } from "../../config/env";
import i18n from "../../i18n";
import { endpoints } from "../../config/endpoints";
import type { UserInvited } from "../../types";

/** Shape ligero del endpoint de validar_client */
export type ValidationFlags = {
  isUser: boolean;
  isCustomer: boolean;
  hasLopd: boolean;
};

/** La API puede devolver null, flags o un UserInvited “completo” */
export type IdentityApiResponse = UserInvited | ValidationFlags | null;

export interface ClientRepository {
  checkIdentityByDni(dni: string): Promise<IdentityApiResponse>;
  requestCreateUserEmail(dni: string, langId?: number): Promise<boolean>;
  getInvitedByCallback(token: string, langId?: number): Promise<UserInvited>;
}

const DEBUG_NET = false;

function assertOk(res: Response, ctx: string) {
  if (!res.ok) {
    const err: any = new Error(`${ctx} failed (${res.status})`);
    err.status = res.status;
    return err;
  }
  return null;
}

export class HttpClientRepository implements ClientRepository {
  private base: string;

  constructor(baseUrl?: string) {
    // ✅ USAR API_BASE_URL (NO BASE_URL) para endpoints app_clients
    const b = (baseUrl ?? env.apiBaseUrl ?? "").replace(/\/+$/, "");
    if (!b) throw new Error("[ENV] API_BASE_URL requerido");
    this.base = b;
  }

  async checkIdentityByDni(dniRaw: string): Promise<IdentityApiResponse> {
    const url = endpoints.appClients.validarClient(
      this.base,
      dniRaw,
      i18n.language || env.languageDefault
    );
    if (DEBUG_NET) console.debug("[NET] validar_client →", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    const maybeErr = assertOk(res, "Identity");
    const text = await res.text();
    if (maybeErr) {
      try {
        (maybeErr as any).raw = text ? JSON.parse(text) : {};
      } catch {
        (maybeErr as any).raw = { message: text || "Error" };
      }
      throw maybeErr;
    }

    if (!text || text.trim() === "") return null;
    try {
      return JSON.parse(text) as IdentityApiResponse;
    } catch {
      return null;
    }
  }

  async requestCreateUserEmail(
    dniRaw: string,
    langIdParam?: number
  ): Promise<boolean> {
    const url = endpoints.appClients.requestNewUserEmail(
      this.base,
      dniRaw,
      langIdParam ?? (i18n.language || env.languageDefault)
    );
    if (DEBUG_NET) console.debug("[NET] nou_usuari (email) →", url);

    const res = await fetch(url, {
      method: "PUT",
      headers: { Accept: "application/json" },
    });

    const maybeErr = assertOk(res, "RequestCreateUserEmail");
    if (maybeErr) {
      let raw: any = {};
      try {
        raw = await res.json();
      } catch {}
      (maybeErr as any).raw = raw;
      throw maybeErr;
    }
    return true;
  }

  async getInvitedByCallback(
    token: string,
    langIdParam?: number
  ): Promise<UserInvited> {
    const url = endpoints.appClients.invitedByToken(
      this.base,
      token,
      langIdParam ?? (i18n.language || env.languageDefault)
    );
    if (DEBUG_NET) console.debug("[NET] nou_usuari (callback) →", url);

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const maybeErr = assertOk(res, "CallbackNouUsuari");
    const text = await res.text();
    if (maybeErr) {
      try {
        (maybeErr as any).raw = text ? JSON.parse(text) : {};
      } catch {
        (maybeErr as any).raw = { message: text || "Error" };
      }
      throw maybeErr;
    }

    try {
      return (text ? JSON.parse(text) : {}) as UserInvited;
    } catch {
      return {} as UserInvited;
    }
  }
}
