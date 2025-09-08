/** IDs de idioma que espera el backend */
export type BackendLang = 1 | 2 | 3; // 1=ca, 2=es, 3=en

const LANG_CODE_TO_ID: Record<string, BackendLang> = {
  ca: 1,
  es: 2,
  en: 3,
};

/** 'ca'|'es'|'en' (o 'es-ES', 'CA', etc.) -> id numérico (fallback: 2 'es') */
export const langToBackend = (lng?: string): BackendLang => {
  const code = (lng || "").slice(0, 2).toLowerCase();
  return LANG_CODE_TO_ID[code] ?? 2;
};

/**
 * Normaliza entradas variadas:
 *  - number -> valida (1|2|3)
 *  - string numérica -> parsea y valida
 *  - string código -> mapea
 * Fallback: 2 ('es').
 */
export const normalizeLangForApi = (lang?: string | number): BackendLang => {
  if (typeof lang === "number") {
    return lang === 1 || lang === 2 || lang === 3 ? lang : 2;
  }
  if (lang && /^\d+$/.test(lang)) {
    const n = Number(lang);
    return n === 1 || n === 2 || n === 3 ? (n as BackendLang) : 2;
  }
  return langToBackend(lang);
};
