export interface User {
  documentType: "DNI" | "NIF" | "NIE";
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneLandlinePrefix: string;
  phoneLandlineNumber: string;
  phoneMobilePrefix: string;
  phoneMobileNumber: string;
  address: string; // direccionPostal.calle
  postalCode: string; // direccionPostal.codigoPostal
  country: string;
  language: string;

  // opcionales UI
  city?: string;
  province?: string;

  // IDs backend
  provinceId?: string | null;
  cityId?: string | null;
}
