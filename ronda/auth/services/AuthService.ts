import { AuthRepository } from "../repositories/AuthRepository";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(username: string, password: string): Promise<string> {
    if (!username || !password) {
      throw new Error("El email y la contraseña son obligatorios");
    }

    try {
      const token = await this.authRepository.login(username, password);
      return token;
    } catch (error: any) {
      throw new Error(
        "Error al iniciar sesión: " + (error.message || "Error desconocido")
      );
    }
  }
}
