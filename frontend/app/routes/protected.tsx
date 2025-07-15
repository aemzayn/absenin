import { Outlet } from "react-router";
import { requireAuth } from "~/api/auth";
import Navbar from "~/components/ui/navbar";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
