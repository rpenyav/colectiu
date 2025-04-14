import { useAuth } from "../auth/context/AuthContext";
import { User } from "../interfaces/User";
import { useUserRepository } from "../repositories/UserRepository";

export function useUserService() {
  const { token } = useAuth();
  const userRepository = useUserRepository();

  const getUserIdFromToken = (): number | null => {
    console.log("getUserIdFromToken - Token:", token);
    if (!token) {
      console.log("getUserIdFromToken - No token available");
      return null;
    }

    try {
      const parts = token.split(".");
      console.log("getUserIdFromToken - Token parts:", parts);

      if (parts.length !== 3) {
        console.log(
          "getUserIdFromToken - Invalid token format: Expected 3 parts"
        );
        return null;
      }

      const payloadBase64 = parts[1];
      console.log("getUserIdFromToken - Payload (base64):", payloadBase64);

      const payloadString = atob(payloadBase64);
      console.log("getUserIdFromToken - Payload (decoded):", payloadString);

      const payload = JSON.parse(payloadString);
      console.log("getUserIdFromToken - Payload (parsed):", payload);

      const userId = payload?.userId || null;
      console.log("getUserIdFromToken - Extracted userId:", userId);

      return userId;
    } catch (error) {
      console.error("Error al decodificar el token JWT:", error);
      return null;
    }
  };

  const fetchUserData = async (): Promise<User | null> => {
    try {
      const userId = getUserIdFromToken();
      console.log("fetchUserData - userId:", userId);

      if (!userId) {
        throw new Error("No se pudo obtener el userId del token");
      }

      const userData = await userRepository.getUserById(userId);
      return userData;
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  };

  const fetchUserAvatar = async (): Promise<string | null> => {
    try {
      const userId = getUserIdFromToken();
      console.log("fetchUserAvatar - userId:", userId);

      if (!userId) {
        throw new Error("No se pudo obtener el userId del token");
      }

      const avatarUri = await userRepository.getUserAvatar(userId);
      console.log("fetchUserAvatar - Avatar URI:", avatarUri);
      return avatarUri;
    } catch (error) {
      console.error("Error al obtener el avatar del usuario:", error);
      return null;
    }
  };

  return { fetchUserData, fetchUserAvatar };
}
