// App.tsx
import "react-native-gesture-handler";
import React from "react";
import {
  NavigationContainer,
  type LinkingOptions,
} from "@react-navigation/native";
import "./src/i18n"; // inicializa i18n
import AppRoutes, { type RootStackParamList } from "./src/navigation/AppRoutes";
import { ClientProvider } from "./src/application/context/ClientContext";

import Toast from "react-native-toast-message";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toastConfig } from "./src/components";
import { env } from "./src/config/env"; // ← usa extra de app.config.ts
import { AuthProvider } from "./src/application/context/AuthContext";

function ToastPortal() {
  const insets = useSafeAreaInsets();
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={insets.top + 12}
      visibilityTime={3500}
    />
  );
}

// Deep links / Universal links
const prefixes = ["appclients://"];
if (env.baseUrl && /^https?:\/\//i.test(env.baseUrl)) {
  prefixes.push(env.baseUrl); // ej. https://appclientsdemo.cronda.coop
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes,
  config: {
    screens: {
      // importante para el email de alta:
      // appclients://callback_nova_contrasenya/:lang/:token
      // y/o https://<tu-dominio>/callback_nova_contrasenya/:lang/:token
      CallbackNewUser: "callback_nova_contrasenya/:lang/:token",
      // el resto de pantallas pueden resolverse por nombre si algún día quieres rutas web
      Start: "",
      RequestAccess: "request_access",
      CreateUser: "create_user",
      Login: "login",
      Splash: "splash",
    },
  },
};

const securityBase =
  env.securityBaseUrl ||
  (process.env.EXPO_PUBLIC_SECURITY_BASE_URL as string | undefined) ||
  "";
// en App.tsx, temporal
console.log("securityBaseUrl (env):", env.securityBaseUrl);
console.log(
  "securityBaseUrl (EXPO_PUBLIC):",
  process.env.EXPO_PUBLIC_SECURITY_BASE_URL
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <AuthProvider securityBaseUrl={securityBase}>
          <ClientProvider>
            <AppRoutes />
          </ClientProvider>
          <ToastPortal />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
