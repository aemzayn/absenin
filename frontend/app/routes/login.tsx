import { AxiosError } from "axios";
import { redirect, useNavigate, type ActionFunctionArgs } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/api/constants";
import type { User } from "~/interfaces/user";
import { AuthService } from "~/services/auth.service";
import { PageLoadError } from "~/components/PageLoadError";
import { Label } from "~/components/ui/label";
import { Building, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "~/components/ui/input";
import { ThemeToggle } from "~/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useAuth } from "~/contexts/auth-contexts";
import { useEffect, useState } from "react";
import { DASHBOARD_ROUTE, HOME_ROUTE } from "~/constants/routes";
import { Button } from "~/components/ui/button";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(DASHBOARD_ROUTE());
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(DASHBOARD_ROUTE());
    } else {
      setError(result.error || "Login failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4">
            <Building className="w-12 h-12 text-blue-600" />
            <ThemeToggle />
          </div>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-gray-100">
              Selamat Datang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Alamat Email
                </Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Kata Sandi
                </Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    placeholder="Masukkan kata sandi Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Butuh bantuan? Hubungi administrator sistem Anda
          </p>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <PageLoadError />;
}
