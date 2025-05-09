import { Outlet } from "react-router";
import { requireAuth } from "~/api/auth";
import Navbar from "~/components/navbar";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
