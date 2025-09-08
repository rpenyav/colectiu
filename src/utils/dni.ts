// src/utils/dni.ts
// Simulación (sustituiremos por tu lógica real / fetch)
// export type DniResult = "CAN_LOGIN" | "NEEDS_LOPD" | "CREATE_USER";

// export const validateDni = async (dni: string): Promise<DniResult> => {
//   // Demo: mapea por último dígito
//   const last = dni.replace(/\D/g, "").slice(-1);
//   await new Promise((r) => setTimeout(r, 700)); // simula latencia
//   if (last === "0" || last === "1" || last === "2") return "CAN_LOGIN";
//   if (last === "3" || last === "4" || last === "5") return "NEEDS_LOPD";
//   return "CREATE_USER";
// };
