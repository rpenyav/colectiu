export * from "./User";
export * from "./NewUserPayload";

export * from "./identity";
export type SN = "S" | "N";

export interface LopdConsents {
  campanyas: boolean; // opcional
  circular: boolean; // opcional
  tratamiento: boolean; // obligatorio (checkbox principal)
}

export interface LopdConsentsDTO {
  swCampanyas: SN;
  swCircular: SN;
  swTratamiento: SN;
}
