import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppLocale {
  id: number;
}

interface LanguageContextType {
  appLocale: AppLocale;
  languageCode: number;
  setAppLocale: (locale: AppLocale) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appLocale, setAppLocaleState] = useState<AppLocale>({ id: 1 }); // Por defecto: catalán (id: 1)

  // Mapa de códigos de idioma
  const languageMap: Record<string, number> = {
    ca: 1,
    es: 2,
    en: 3,
  };

  // Cargar appLocale desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const storedLocale = await AsyncStorage.getItem("appLocale");
        if (storedLocale) {
          const parsedLocale: AppLocale = JSON.parse(storedLocale);
          setAppLocaleState(parsedLocale);
        }
      } catch (error) {
        console.error("Error loading appLocale from AsyncStorage:", error);
      }
    };
    loadLocale();
  }, []); // Solo se ejecuta al montar el componente

  const setAppLocale = async (locale: AppLocale) => {
    try {
      // Evitar actualizaciones innecesarias
      if (locale.id === appLocale.id) {
        return;
      }
      setAppLocaleState(locale);
      await AsyncStorage.setItem("appLocale", JSON.stringify(locale));
    } catch (error) {
      console.error("Error saving appLocale to AsyncStorage:", error);
    }
  };

  const languageCode = appLocale.id;

  const contextValue: LanguageContextType = {
    appLocale,
    languageCode,
    setAppLocale,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe ser usado dentro de un LanguageProvider");
  }
  return context;
};

// Exportamos el idioma por defecto
export const DEFAULT_LANGUAGE_CODE = 1; // Valor inicial (catalán)
