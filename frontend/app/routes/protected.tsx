import { Outlet } from "react-router";
import { requireAuth } from "~/api/auth";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return <Outlet />;
}
