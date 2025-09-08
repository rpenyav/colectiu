// src/application/context/ClientContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import { ClientService } from "../../domain/services/ClientService";
import { HttpClientRepository } from "../../domain/repositories/ClientRepository";
import { env } from "../../config/env";

type Ctx = {
  checkIdentity: (dni: string) => ReturnType<ClientService["checkIdentity"]>;
  requestCreateUserEmail: (
    dni: string
  ) => ReturnType<ClientService["requestCreateUserEmail"]>;
  prefillFromCallback: (
    token: string
  ) => ReturnType<ClientService["prefillFromCallback"]>;
  // acceptLopd?: (dni: string) => ReturnType<ClientService["acceptLopd"]>;
};

const ClientContext = createContext<Ctx | null>(null);

export const ClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  if (!env.apiBaseUrl) {
    throw new Error(
      "[ENV] API_BASE_URL no definido. Configúralo en .env y app.config.ts (extra.apiBaseUrl)"
    );
  }

  // ✅ USAR API_BASE_URL para todo lo NO-login
  const repo = useMemo(() => new HttpClientRepository(env.apiBaseUrl), []);
  const service = useMemo(() => new ClientService(repo), [repo]);

  return (
    <ClientContext.Provider
      value={{
        checkIdentity: (dni) => service.checkIdentity(dni),
        requestCreateUserEmail: (dni) => service.requestCreateUserEmail(dni),
        prefillFromCallback: (token) => service.prefillFromCallback(token),
        // acceptLopd: (dni) => service.acceptLopd(dni),
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used within ClientProvider");
  return ctx;
};
