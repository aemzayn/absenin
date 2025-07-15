import { AxiosError } from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Form, Link, redirect, type ActionFunctionArgs } from "react-router";
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

    return redirect("/login");
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 400) {
        // toast.error("Email sudah terdaftar");
      } else if (status === 500) {
        // toast.error("Terjadi kesalahan pada server");
      } else {
        // toast.error("Gagal mendaftar, silakan coba lagi");
      }
    } else {
      // toast.error("Gagal mendaftar, silakan coba lagi");
    }
  }
}

export default function RegisterRoute() {
  return (
    <Form method="post">
      <Card title="Daftar Akun">
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <div>
            <div>
              <label htmlFor="name">Nama lengkap</label>
            </div>
            <InputText id="name" type="text" name="name" required />
          </div>

          <div>
            <div>
              <label htmlFor="password">Kata sandi</label>
            </div>
            <Password id="password" type="password" name="password" required />
          </div>

          <div>
            <div>
              <label htmlFor="confirmPassword">Konfirmasi kata sandi</label>
            </div>
            <Password
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
            />
          </div>
        </div>
        <Button type="submit">Daftar</Button>
        <div>
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </div>
      </Card>
    </Form>
  );
}
