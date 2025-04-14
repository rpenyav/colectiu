import { useAuth } from "../auth/context/AuthContext";
import { User } from "../interfaces/User";
import { useUserRepository } from "../repositories/UserRepository";

export function useUserService() {
  const { token } = useAuth();
  const userRepository = useUserRepository();

  const getUserIdFromToken = (): number | null => {
    if (!token) {
      console.log("getUserIdFromToken - No token available");
      return null;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        return null;
      }

      const payloadBase64 = parts[1];

      const payloadString = atob(payloadBase64);

      const payload = JSON.parse(payloadString);

      const userId = payload?.userId || null;

      return userId;
    } catch (error) {
      console.error("Error al decodificar el token JWT:", error);
      return null;
    }
  };

  const fetchUserData = async (): Promise<User | null> => {
    try {
      const userId = getUserIdFromToken();

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

      if (!userId) {
        throw new Error("No se pudo obtener el userId del token");
      }

      const avatarUri = await userRepository.getUserAvatar(userId);
      return avatarUri;
    } catch (error) {
      console.error("Error al obtener el avatar del usuario:", error);
      return null;
    }
  };

  return { fetchUserData, fetchUserAvatar };
}
