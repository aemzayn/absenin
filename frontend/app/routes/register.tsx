import { AxiosError } from "axios";
import { useState } from "react";
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
import { cn } from "~/lib/utils";
import { AuthService } from "~/services/auth.service";

export function meta() {
  return [{ title: "Daftar Akun" }];
}

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setSubmitting(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const name = formData.get("name") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!email || !name || !password || !confirmPassword) {
        toast.error("Semua kolom harus diisi");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Kata sandi tidak cocok");
        return;
      }

      const res = await AuthService.register({
        email,
        name,
        password,
      });

      const data = res.data;
      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      sessionStorage.setItem("REFRESH_TOKEN", refreshToken);
      sessionStorage.setItem("ACCESS_TOKEN", accessToken);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form className="min-w-sm md:min-w-md" onSubmit={handleSubmit}>
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
          <Button type="submit" className="w-full" disabled={submitting}>
            Daftar
          </Button>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className={cn(
                "underline underline-offset-4",
                submitting && "pointer-events-none"
              )}
            >
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
}
