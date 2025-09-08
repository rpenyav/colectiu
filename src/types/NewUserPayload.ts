export interface PostalAddressPayload {
  calle: string;
  codigoPostal: string;
  poblacion?: { nombre: string; provincia?: { nombre: string } };
  extranjero: boolean;
  txtProvincia?: string;
  txtPoblacion?: string;
}

export interface TerceroPayload {
  id?: number; // si viene de cliente existente
  telefono?: string;
  movil?: string;
  nif: string;
  nombre: string;
  observaciones?: string | null;
  email?: string;
  tipoIden: string | number;
  dp2Write: boolean;
  direccionPostal: PostalAddressPayload;
}

export interface CreateUserFromClientRequest {
  password: string;
  tercero: TerceroPayload;
}
