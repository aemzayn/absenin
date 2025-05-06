import { Outlet } from "react-router";
import { requireAuth } from "~/api/auth";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return (
    <div className="container mx-auto p-4 max-w-md bg-blue-100 min-h-screen shadow-md">
      <Outlet />
    </div>
  );
}
