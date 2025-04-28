import { Form, Link, redirect, type ActionFunctionArgs } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
import type { User } from "~/interfaces/user";
import { AuthService } from "~/services/auth.service";

export function meta() {
  return [{ title: "Login" }];
}

export function clientLoader() {
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    throw redirect("/");
  }
  return null;
}

type LoginResponseData = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
};

export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await AuthService.login({ email, password });
    const data = res.data as LoginResponseData;
    const accessToken = data.data.accessToken;
    const refreshToken = data.data.refreshToken;

    sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    sessionStorage.setItem(ACCESS_TOKEN, accessToken);
  } catch (error) {
    console.error("Login error:", error);
  }
}

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(formData);

    console.log({
      email,
      password,
    });
  };

  return (
    <Form
      className="w-md mx-auto bg-gray-50 p-10 rounded-xl shadow-lg flex flex-col gap-4"
      method="post"
    >
      <h1 className="text-gray-900  mb-5 text-center">
        Masuk dengan akun Anda
      </h1>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Kata sandi
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <button type="submit">Login</button>

      <div className="mt-5 text-center">
        <p className="text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Daftar disini
          </Link>
        </p>
      </div>
    </Form>
  );
}

export function ErrorBoundary() {
  return (
    <div className="w-md mx-auto bg-gray-50 p-10 rounded-xl shadow-lg flex flex-col gap-4">
      <h1 className="text-gray-900 mb-5 text-center">Terjadi kesalahan</h1>
      <p className="text-sm text-gray-500">
        Maaf, terjadi kesalahan saat memuat halaman ini.
      </p>
    </div>
  );
}
