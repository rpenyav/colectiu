import { useAuth } from "../auth/context/AuthContext";
import { FetchWithAuthOptions } from "../interfaces/interfaces";

/**
 * Realiza una solicitud HTTP autenticada usando el token del AuthContext.
 * @param url - La URL de la solicitud.
 * @param options - Opciones de la solicitud (method, body, headers, etc.).
 * @returns La respuesta de la solicitud.
 * @throws Error si no hay token o si la solicitud falla.
 */
export function useFetchWithAuth() {
  const { token } = useAuth();

  const fetchWithAuth = async (
    url: string,
    options: FetchWithAuthOptions = {}
  ): Promise<Response> => {
    // Verificar si hay token
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Por favor, inicia sesión."
      );
    }

    // Configurar los encabezados
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Manejar códigos de estado HTTP
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      } else if (response.status === 403) {
        throw new Error("Acceso denegado.");
      } else if (response.status >= 500) {
        throw new Error(`Error en el servidor: ${response.status}`);
      } else if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error en la solicitud: ${response.status} - ${errorText}`
        );
      }

      return response;
    } catch (error) {
      console.error("Error en fetchWithAuth:", error);
      throw error;
    }
  };

  return fetchWithAuth;
}
