import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
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
    return apiClient.post("/v1/auth/register", {
      email,
      name,
      password,
    });
  }

  static async logout() {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    delete apiClient.defaults.headers.common["Authorization"];
    delete apiClient.defaults.headers.common["x-refresh-token"];
  }
}
