import { LopdConsents, LopdConsentsDTO, SN } from "../types";

export const boolToSN = (b: boolean): SN => (b ? "S" : "N");

export const lopdToDTO = (c: LopdConsents): LopdConsentsDTO => ({
  swCampanyas: boolToSN(c.campanyas),
  swCircular: boolToSN(c.circular),
  swTratamiento: boolToSN(c.tratamiento),
});
