// src/config/env.ts
import Constants from "expo-constants";

type Extra = {
  appName: string;
  apiBaseUrl: string;
  baseUrl: string;
  languageDefault: "ca" | "es" | "en";
  securityBaseUrl: string;
};

// Robusto para nativo y web:
const rawExtra =
  (Constants as any)?.expoConfig?.extra ??
  (Constants as any)?.manifest?.extra ??
  {};

const extra = rawExtra as Partial<Extra>;

export const env: Extra = {
  appName: extra.appName ?? "app-clients-mobile",
  apiBaseUrl: extra.apiBaseUrl ?? "",
  baseUrl: extra.baseUrl ?? "",
  languageDefault: (extra.languageDefault as Extra["languageDefault"]) ?? "ca",
  securityBaseUrl:
    (extra.securityBaseUrl as string | undefined) ??
    (process.env.EXPO_PUBLIC_SECURITY_BASE_URL as string | undefined) ??
    "", // si sigue vacío, petará el AuthProvider (bien)
};
