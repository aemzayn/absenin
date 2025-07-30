import { Outlet } from "react-router";
import { requireAuth } from "~/api/auth";
import { AuthGuard } from "~/components/auth-guard";
import Navbar from "~/components/ui/navbar/Navbar";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}
