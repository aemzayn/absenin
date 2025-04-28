import apiClient from "../api/client";

export class AuthService {
  static async login({ email, password }: { email: string; password: string }) {
    return apiClient.post("/v1/auth/login", {
      email,
      password,
    });
  }

  static async register({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    return apiClient.post("/v1/auth/login", {
      email,
      name,
      password,
    });
  }
}
