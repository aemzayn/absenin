"use client";

import { isAxiosError } from "axios";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
import type { RegisterResponse, RegisterUser } from "~/interfaces/auth";
import { AuthService } from "~/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string | null }>;
  register: (user: RegisterUser) => Promise<RegisterResponse>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LoginResponseData = {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
};

const USER_SESSSION_KEY = "orphana-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isValidUser = (user: User | null): user is User => {
    return (
      user !== null &&
      typeof user.id === "number" &&
      typeof user.name === "string" &&
      typeof user.email === "string"
    );
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem(USER_SESSSION_KEY);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (isValidUser(parsedUser)) {
        setUser(parsedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await AuthService.login({ email, password });
      const data = res.data as LoginResponseData;

      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;
      const user = data.data.user;

      setUser(user);

      sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
      sessionStorage.setItem(ACCESS_TOKEN, accessToken);
      sessionStorage.setItem(USER_SESSSION_KEY, JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          return {
            success: false,
            error: "Akun tidak ditemukan",
          };
        } else if (status === 400) {
          return {
            success: false,
            error: "Email atau kata sandi salah",
          };
        }
      }
      return {
        success: false,
        error: "Terjadi kesalahan saat login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (user: RegisterUser) => {
    try {
      await AuthService.register(user);
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.log("Register error:", error);
      return {
        success: false,
        error: "Terjadi kesalahan saat mendaftar",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
