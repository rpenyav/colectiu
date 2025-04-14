import { LOGIN_URL } from "../../config";
import { AuthRepository } from "./AuthRepository";

export class AuthRepositoryImpl implements AuthRepository {
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const responseText = await response.text();

      // Manejar códigos de estado
      if (response.status === 401) {
        throw new Error("Credenciales incorrectas");
      } else if (response.status === 403) {
        throw new Error("Acceso denegado");
      } else if (response.status >= 500) {
        throw new Error(
          `Error en el servidor: ${response.status} - ${responseText}`
        );
      } else if (!response.ok) {
        throw new Error(
          `Error en el login: ${response.status} - ${responseText}`
        );
      }

      // Obtener el token del encabezado Authorization
      const authHeader = response.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No se recibió el encabezado Authorization");
      }

      // Extraer el token (esperamos formato "Bearer <token>")
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        throw new Error("Formato de Authorization inválido");
      }

      const token = tokenParts[1];
      return token;
    } catch (error) {
      console.error("Error en AuthRepositoryImpl:", error);
      throw error;
    }
  }
}
