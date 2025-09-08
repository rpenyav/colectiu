// src/types/identity.ts

/* ================== Direcciones / Poblaciones ================== */

export interface ProvinciaRef {
  id: number;
  /** opcional: algunos endpoints lo devuelven */
  nombre?: string;
}

export interface PoblacionRef {
  id: number;
  /** opcional: algunos endpoints lo devuelven */
  nombre?: string;
  /** opcional: puede venir sólo el id, o id+nombre */
  provincia?: ProvinciaRef;
}

export interface DireccionPostalInput {
  calle: string;
  codigoPostal: string;
  /** puede venir id-only o con nombres */
  poblacion?: PoblacionRef;

  // Soporte texto libre / extranjero
  extranjero?: boolean | null;
  txtProvincia?: string | null;
  txtPoblacion?: string | null;
}

/* ================== Direcciones / Poblaciones ================== */

export interface PoblacionRefById {
  id: number;
  provincia: { id: number };
}

export interface DireccionPostalInput {
  calle: string;
  codigoPostal: string;
  poblacion?: PoblacionRef;

  // Soporte texto libre / extranjero
  extranjero?: boolean | null;
  txtProvincia?: string | null;
  txtPoblacion?: string | null;
}

/* ================== UserInvited (shape backend) ================== */

export interface UserInvited {
  validoSN: "S" | "N";
  id: number;

  telefono?: string;
  movil?: string;
  nif: string;
  nombre: string;
  observaciones: string | null;
  email?: string;
  /** En backend a veces es "1"|"3" o número → dejamos union */
  tipoIden: string | number;
  dp2Write: boolean;

  // flags principales
  isUser: boolean;
  isClientParticular: boolean;
  isClientEmpresa: boolean;
  lopd: boolean;

  // Campos extra que a veces llegan
  genero?: { id: number; validoSN: "S" | "N"; descripcion: string } | null;
  fechaNacimiento?: string; // ISO
  lugarNacimiento?: string;
  nacionalidad?: {
    id: number;
    validoSN: "S" | "N";
    descripcion: string;
  } | null;
  nombreMadre?: string;
  nombrePadre?: string;
  fax?: string;
  fecultenvio?: string | null;
  fexproxenvio?: string | null;
  enviocastella?: boolean | null;
  tegestioIRPF?: boolean | null;

  // Dirección principal (la que solemos mapear)
  direccionPostal?: DireccionPostalInput;

  // Algunas respuestas incluyen una segunda dirección
  direccionPostal2?: DireccionPostalInput;

  // Alias que a veces aparecen en responses (duplican los anteriores)
  clientParticular?: boolean;
  clientEmpresa?: boolean;
  user?: boolean;
}

/* ================== IndividualClient (UI / formulario) ================== */

export interface IndividualClient {
  id?: number;
  nif: string;
  documentType: "DNI" | "NIE" | "NIF";
  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phoneLandline?: string;
  phoneMobile?: string;

  birthDate?: string; // yyyy-mm-dd
  birthPlace?: string;
  genderId?: number | null;
  nationalityId?: number | null;
  motherName?: string;
  fatherName?: string;

  // Prefill “estilo J2”
  address?: string;
  postalCode?: string;
  provinceId?: string | number | null;
  cityId?: string | number | null;

  // Opcionales (display)
  province?: string;
  city?: string;
}
