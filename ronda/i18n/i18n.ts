import * as I18nModule from "i18n-js";
import ca from "../locales/ca.json";
import es from "../locales/es.json";
import en from "../locales/en.json";

// Crear una nueva instancia de I18n
const i18n = new I18nModule.I18n();

// Configurar las traducciones
i18n.translations = {
  ca,
  es,
  en,
};

// Configurar el idioma por defecto
i18n.defaultLocale = "ca";
i18n.locale = "ca";
i18n.fallbacks = true;

export default i18n;
