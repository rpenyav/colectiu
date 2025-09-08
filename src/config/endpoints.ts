// src/config/endpoints.ts
import { normalizeLangForApi } from "../utils/lang";

/**
 * Construye bases y paths de la API.
 * No hace fetch; solo devuelve strings para que los repos las usen.
 *
 * Nota: NO añade ni quita slashes a lo loco; cada función limpia su base.
 */

const cleanBase = (base?: string) => {
  if (!base) throw new Error("[endpoints] base URL requerida");
  return base.replace(/\/+$/, "");
};

export const endpoints = {
  appClients: {
    base(baseUrl: string) {
      return cleanBase(baseUrl);
    },

    /** POST /api/:lang/app_clients/clients/validar_client/:dni */
    validarClient(baseUrl: string, dni: string, lang?: string | number) {
      const base = cleanBase(baseUrl);
      const langId = normalizeLangForApi(lang);
      const nif = (dni ?? "").replace(/\s|-/g, "").toUpperCase();
      return `${base}/api/${langId}/app_clients/clients/validar_client/${encodeURIComponent(
        nif
      )}`;
    },

    /** PUT /api/:lang/app_clients/usuaris/nou_usuari/:dni/true */
    requestNewUserEmail(baseUrl: string, dni: string, lang?: string | number) {
      const base = cleanBase(baseUrl);
      const langId = normalizeLangForApi(lang);
      const nif = (dni ?? "").replace(/\s|-/g, "").toUpperCase();
      return `${base}/api/${langId}/app_clients/usuaris/nou_usuari/${encodeURIComponent(
        nif
      )}/true`;
    },

    /** GET /api/:lang/app_clients/usuaris/nou_usuari/:token */
    invitedByToken(baseUrl: string, token: string, lang?: string | number) {
      const base = cleanBase(baseUrl);
      const langId = normalizeLangForApi(lang);
      return `${base}/api/${langId}/app_clients/usuaris/nou_usuari/${encodeURIComponent(
        token
      )}`;
    },
  },

  security: {
    base(securityBaseUrl: string) {
      return cleanBase(securityBaseUrl);
    },

    /** POST /api/login_client  (otro proyecto; “a mano” aquí) */
    loginClient(securityBaseUrl: string) {
      const base = cleanBase(securityBaseUrl);
      return `${base}/api/login_client`;
    },
  },
};
