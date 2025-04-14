import { useFetchWithAuth } from "../api/api";
import { useAuth } from "../auth/context/AuthContext";
import { USER_URL, USER_AVATAR_URL } from "../config";
import { User } from "../interfaces/User";

export interface UserRepository {
  getUserById(userId: number): Promise<User>;
  getUserAvatar(userId: number): Promise<string | null>;
}

export function useUserRepository() {
  const fetchWithAuth = useFetchWithAuth();
  const { token } = useAuth();

  const getUserById = async (userId: number): Promise<User> => {
    try {
      const response = await fetchWithAuth(`${USER_URL}/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      const userData: User = await response.json();

      return userData;
    } catch (error) {
      console.error(
        "UserRepository - Error al obtener los datos del usuario:",
        error
      );
      throw error;
    }
  };

  const getUserAvatar = async (userId: number): Promise<string | null> => {
    const url = USER_AVATAR_URL.replace(":userId", userId.toString());

    try {
      const response = await fetchWithAuth(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch avatar: ${response.status}`);
      }

      const blob = await response.blob();

      const reader = new FileReader();
      return new Promise<string | null>((resolve) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = () => {
          console.error("UserRepository - Error converting blob to base64");
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(
        "UserRepository - Error al obtener el avatar del usuario:",
        error
      );
      return null;
    }
  };

  return { getUserById, getUserAvatar };
}
