// app.config.ts
import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const name = process.env.APP_NAME ?? "app-clients-mobile";
  const apiBaseUrl = process.env.API_BASE_URL ?? "";
  const baseUrl = process.env.BASE_URL ?? ""; // p.ej. https://appclientsdemo.cronda.coop
  const languageDefault = process.env.LANGUAGE_DEFAULT ?? "ca";
  const securityBaseUrl = process.env.SECURITY_BASE_URL ?? ""; // 👈 NUEVO

  // Si tenemos BASE_URL con https, extraemos el dominio para universal/app links
  let associatedDomain: string | undefined;
  try {
    if (baseUrl && /^https?:\/\//i.test(baseUrl)) {
      associatedDomain = new URL(baseUrl).host; // ej. appclientsdemo.cronda.coop
    }
  } catch {
    // no-op
  }

  return {
    ...config,
    name,
    slug: "app-clients-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      backgroundColor: "#ffffff",
      resizeMode: "contain",
    },

    // ⚠️ esquema para deep links: appclients://
    scheme: "appclients",

    ios: {
      supportsTablet: true,
      // bundleIdentifier: "coop.cronda.appclients",
      ...(associatedDomain
        ? { associatedDomains: [`applinks:${associatedDomain}`] }
        : {}),
    },

    android: {
      softwareKeyboardLayoutMode: "resize",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      // package: "coop.cronda.appclients",
      ...(associatedDomain
        ? {
            intentFilters: [
              {
                action: "VIEW",
                autoVerify: true,
                data: [
                  {
                    scheme: "https",
                    host: associatedDomain,
                    pathPrefix: "/",
                  },
                ],
                category: ["BROWSABLE", "DEFAULT"],
              },
            ],
          }
        : {}),
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },

    plugins: ["expo-localization", "expo-secure-store"],

    // ⚠️ Todo lo que pongas en "extra" viaja en el binario (no metas secretos)
    extra: {
      appName: name,
      apiBaseUrl,
      baseUrl,
      languageDefault,
      securityBaseUrl, // 👈 NUEVO: disponible en Constants.expoConfig.extra.securityBaseUrl

      eas: { projectId: process.env.EAS_PROJECT_ID }, // opcional para EAS
    },
  };
};
