import apiClient from "../api/client";

export class AuthService {
  static async login({ email, password }: { email: string; password: string }) {
    return apiClient.post("/v1/auth/login", {
      email,
      password,
    });
  }
}
