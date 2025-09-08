// src/domain/services/AuthService.ts
import type {
  AuthRepository,
  LoginApiResponse,
  LoginBody,
} from "../repositories/AuthRepository";

export class AuthService {
  constructor(
    private repo: AuthRepository,
    private serverSecurityBase: string
  ) {}

  /** Devuelve { token, raw } normalizado (token = access_token | authentication_token) */
  async signIn(
    body: LoginBody
  ): Promise<{ token: string; raw: LoginApiResponse }> {
    const res = await this.repo.login(this.serverSecurityBase, body);
    const token = res.access_token || res.authentication_token;
    if (!token) throw new Error("Token no presente en la respuesta de login");
    return { token, raw: res };
  }
}
