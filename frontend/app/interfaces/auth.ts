export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  success: boolean;
  error: string | null;
};

export type LoginUser = {
  email: string;
  password: string;
};
