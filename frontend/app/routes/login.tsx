import { AxiosError } from "axios";
import { Form, Link, redirect, type ActionFunctionArgs } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
import type { User } from "~/interfaces/user";
import { AuthService } from "~/services/auth.service";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { PageLoadError } from "~/components/PageLoadError";

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
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 404) {
        // toast("Akun tidak ditemukan");
      } else if (status === 400) {
        // toast("Email atau kata sandi salah");
      } else {
        // toast("Terjadi kesalahan saat login");
      }
    } else {
      // toast("Terjadi kesalahan saat login");
    }
  }
}

export default function LoginRoute() {
  return (
    <Form method="post">
      <Card title="Login">
        <div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">Email</span>
            <InputText
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">Kata Sandi</span>
            <Password id="password" name="password" required />
          </div>
        </div>

        <Button type="submit">Login</Button>

        <div>
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </Card>
    </Form>
  );
}

export function ErrorBoundary() {
  return <PageLoadError />;
}
