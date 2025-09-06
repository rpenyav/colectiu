// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import es from "./locales/es.json";
import en from "./locales/en.json";
import ca from "./locales/ca.json"; // 👈 crea este archivo con las traducciones en catalán

// Detecta idioma del dispositivo (ej. "es-ES", "ca-ES", "en-US")
const deviceLocale =
  (() => {
    try {
      const locales = getLocales();
      return locales?.[0]?.languageTag || "ca";
    } catch {
      return "ca";
    }
  })() || "ca";

// Normaliza a "ca", "es" o "en"
let initialLng: "ca" | "es" | "en" = "ca"; // 👈 catalán por defecto
const lower = deviceLocale.toLowerCase();
if (lower.startsWith("es")) initialLng = "es";
else if (lower.startsWith("en")) initialLng = "en";
else if (lower.startsWith("ca")) initialLng = "ca";

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: initialLng,
  fallbackLng: "ca", // 👈 fallback también a catalán
  interpolation: { escapeValue: false },
  resources: {
    ca: { translation: ca },
    es: { translation: es },
    en: { translation: en },
  },
});

export default i18n;
