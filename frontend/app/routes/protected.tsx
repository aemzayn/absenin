import { QrCode } from "lucide-react";
import { Link, Outlet } from "react-router";
import { requireAuth } from "~/api/auth";
import { AppSidebar } from "~/components/app-sidebar";
import { AuthGuard } from "~/components/auth-guard";
import { InstitutionSelector } from "~/components/institution-selector";
import { PermissionGuard } from "~/components/permission-guard";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import Navbar from "~/components/ui/navbar/Navbar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { PermissionsProvider } from "~/contexts/permissions-context";

export async function clientLoader() {
  requireAuth();
}

export default function ProtectedRoute() {
  return (
    <AuthGuard>
      <PermissionsProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1 flex flex-col min-w-0">
              {/* Mobile Header */}
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                {/* <MobileNav /> */}
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-lg font-semibold">
                    Orphanage Management
                  </h1>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="scanner.use">
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Link to="/scanner">
                          <QrCode className="h-4 w-4 mr-2" />
                          Scan
                        </Link>
                      </Button>
                    </PermissionGuard>
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {/* Desktop Header */}
              <header className="hidden md:flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-lg font-semibold">
                    Orphanage Management
                  </h1>
                  <div className="flex items-center gap-4">
                    <InstitutionSelector />
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-auto">
                {" "}
                <Outlet />
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </PermissionsProvider>
    </AuthGuard>
  );
}
