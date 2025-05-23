import { AxiosError } from "axios";
import { Form, Link, redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";
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
import { AuthService } from "~/services/auth.service";

export function meta() {
  return [{ title: "Daftar Akun" }];
}

export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !name || !password || !confirmPassword) {
    throw new Error("Semua kolom harus diisi");
  }

  if (password !== confirmPassword) {
    throw new Error("Kata sandi tidak cocok");
  }

  try {
    await AuthService.register({
      email,
      name,
      password,
    });

    toast.success("Akun berhasil dibuat", {
      description: "Silakan masuk ke akun Anda",
    });

    return redirect("/login");
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 400) {
        toast.error("Email sudah terdaftar");
      } else if (status === 500) {
        toast.error("Terjadi kesalahan pada server");
      } else {
        toast.error("Gagal mendaftar, silakan coba lagi");
      }
    } else {
      toast.error("Gagal mendaftar, silakan coba lagi");
    }
  }
}

export default function RegisterPage() {
  return (
    <Form className="w-md mx-auto rounded-xl" method="post">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Daftar</CardTitle>
          <CardDescription>Buat akun baru.</CardDescription>
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
                <Label htmlFor="name">Nama lengkap</Label>
              </div>
              <Input id="name" type="text" name="name" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata sandi</Label>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Konfirmasi kata sandi</Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Daftar
          </Button>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
}
