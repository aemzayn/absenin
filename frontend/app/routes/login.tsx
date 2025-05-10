import { AxiosError } from "axios";
import { Form, Link, redirect, type ActionFunctionArgs } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { User } from "~/interfaces/user";
import { toast } from "sonner";
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
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 404) {
        toast("Akun tidak ditemukan");
      } else if (status === 400) {
        toast("Email atau kata sandi salah");
      } else {
        toast("Terjadi kesalahan saat login");
      }
    } else {
      toast("Terjadi kesalahan saat login");
    }
  }
}

export default function Login() {
  return (
    <Form className="w-md mx-auto rounded-xlß" method="post">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Masuk ke akun mu</CardTitle>
          <CardDescription>
            Silahkan masukkan email dan password untuk masuk ke akun mu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata sandi</Label>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Daftar
            </Link>
          </div>
        </CardFooter>
      </Card>
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
