// src/domain/services/ClientService.ts
import type { ClientRepository } from "../repositories/ClientRepository";
import type { IndividualClient, UserInvited } from "../../types";

// ——— helpers ———
export const normalizeDni = (dni: string) =>
  dni.replace(/\s|-/g, "").toUpperCase();

export const validateDniFormat = (dni: string): string | null => {
  const n = normalizeDni(dni);
  if (n.length < 7) return "DNI demasiado corto";
  return null;
};

/** Mapea UserInvited → IndividualClient para prefill */
const invitedToIndividual = (u: UserInvited): IndividualClient => {
  const [firstName, ...rest] = (u.nombre ?? "").split(" ");
  const lastName = rest.join(" ");
  const dir =
    u.direccionPostal &&
    (u.direccionPostal.calle || u.direccionPostal.codigoPostal)
      ? u.direccionPostal
      : u.direccionPostal2 || undefined;

  return {
    id: u.id,
    nif: u.nif,
    documentType: (typeof u.tipoIden === "string" ? u.tipoIden : "DNI") as
      | "DNI"
      | "NIE"
      | "NIF",
    firstName: firstName || "",
    lastName: lastName || "",
    fullName: u.nombre ?? `${lastName}, ${firstName}`.trim(),
    email: u.email ?? "",
    phoneLandline: u.telefono,
    phoneMobile: u.movil,
    birthDate: u.fechaNacimiento,
    birthPlace: u.lugarNacimiento,
    genderId: u.genero?.id ?? null,
    nationalityId: u.nacionalidad?.id ?? null,
    motherName: u.nombreMadre,
    fatherName: u.nombrePadre,

    // Prefill “estilo J2”
    address: dir?.calle ?? "",
    postalCode: dir?.codigoPostal ?? "",
    cityId: dir?.poblacion?.id ?? null,
    provinceId: dir?.poblacion?.provincia?.id ?? null,
    city: (dir as any)?.poblacion?.nombre ?? undefined,
    province: (dir as any)?.poblacion?.provincia?.nombre ?? undefined,
  };
};

// ——— tipos de resolución ———
export type IdentityResolved =
  | { kind: "NEW"; isUser: false; isCustomer: false; hasLopd: false }
  | {
      kind: "EXISTING_CLIENT_NO_LOPD";
      isUser: false;
      isCustomer: IndividualClient;
      hasLopd: false;
    }
  | {
      kind: "EXISTING_CLIENT_WITH_LOPD";
      isUser: false;
      isCustomer: IndividualClient;
      hasLopd: true;
    }
  | { kind: "USER_READY"; isUser: true; isCustomer: true; hasLopd: boolean };

// ——— type guards ———
type ValidationFlags = {
  isUser: boolean;
  isCustomer: boolean; // <- sólo boolean en validar_client
  hasLopd: boolean;
};

function isValidationFlags(x: any): x is ValidationFlags {
  return (
    x &&
    typeof x === "object" &&
    typeof x.isUser === "boolean" &&
    typeof x.hasLopd === "boolean" &&
    typeof (x as any).isCustomer !== "undefined"
  );
}

function hasClientRoleFlags(x: any): x is {
  isClientParticular?: boolean;
  isClientEmpresa?: boolean;
} {
  return (
    x &&
    typeof x === "object" &&
    ("isClientParticular" in x || "isClientEmpresa" in x)
  );
}

export class ClientService {
  constructor(private repo: ClientRepository) {}

  async checkIdentity(dniRaw: string): Promise<IdentityResolved> {
    const dni = normalizeDni(dniRaw);
    const resp = (await this.repo.checkIdentityByDni(dni)) as any;

    // A — NO hay cliente
    if (!resp) {
      return { kind: "NEW", isUser: false, isCustomer: false, hasLopd: false };
    }

    // Caso 1: el repo devolvió el objeto "ligero" {isUser,isCustomer,hasLopd}
    if (isValidationFlags(resp)) {
      // C) cualquier isUser && isCustomer → USER_READY (ignorando hasLopd)
      if (resp.isUser === true && resp.isCustomer === true) {
        return {
          kind: "USER_READY",
          isUser: true,
          isCustomer: true,
          hasLopd: !!resp.hasLopd,
        };
      }

      // B) Cliente existente sin usuario → RequestAccess (con/sin LOPD)
      if (!resp.isUser && resp.isCustomer === true) {
        const minimal: IndividualClient = {
          nif: dni,
          documentType: "DNI",
          firstName: "",
          lastName: "",
          fullName: "",
          email: "",
        };
        return resp.hasLopd
          ? {
              kind: "EXISTING_CLIENT_WITH_LOPD",
              isUser: false,
              isCustomer: minimal,
              hasLopd: true,
            }
          : {
              kind: "EXISTING_CLIENT_NO_LOPD",
              isUser: false,
              isCustomer: minimal,
              hasLopd: false,
            };
      }

      // A) No hay cliente → alta completa
      return { kind: "NEW", isUser: false, isCustomer: false, hasLopd: false };
    }

    // Caso 2: el repo devolvió un UserInvited completo
    const invited = resp as UserInvited;

    // C) Si invited.isUser === true asumimos que también es cliente y vamos a login (ignora LOPD)
    if (invited.isUser) {
      return {
        kind: "USER_READY",
        isUser: true,
        isCustomer: true,
        hasLopd: !!invited.lopd,
      };
    }

    const existsAsClient = hasClientRoleFlags(invited)
      ? !!(invited.isClientParticular || invited.isClientEmpresa)
      : false;

    // B) Cliente existente sin usuario
    if (!invited.isUser && existsAsClient) {
      if (invited.lopd) {
        return {
          kind: "EXISTING_CLIENT_WITH_LOPD",
          isUser: false,
          isCustomer: invitedToIndividual(invited),
          hasLopd: true,
        };
      }
      return {
        kind: "EXISTING_CLIENT_NO_LOPD",
        isUser: false,
        isCustomer: invitedToIndividual(invited),
        hasLopd: false,
      };
    }

    // Fallback conservador → alta completa
    return { kind: "NEW", isUser: false, isCustomer: false, hasLopd: false };
  }

  /** Paso email (J2): envía email con enlace (token) */
  async requestCreateUserEmail(dni: string): Promise<boolean> {
    return await this.repo.requestCreateUserEmail(dni);
  }

  /** Callback por token: trae datos y los mapea para prefill */
  async prefillFromCallback(token: string): Promise<{
    prefill: IndividualClient;
    hasLopdAlready: boolean;
  }> {
    const invited = await this.repo.getInvitedByCallback(token);
    return {
      prefill: invitedToIndividual(invited),
      hasLopdAlready: !!invited.lopd,
    };
  }

  // Si más adelante exponéis aceptación de LOPD:
  // async acceptLopd(dni: string): Promise<{ ok: boolean }> {
  //   return this.repo.acceptLopd(dni);
  // }
}
