import { Link, useMatch, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { AuthService } from "~/services/auth.service";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const isHome = useMatch("/") != null;
  const isEvent = useMatch("/event/*") != null;
  const isOrganization = useMatch("/organization/*") != null;

  const navigate = useNavigate();

  const className = (isActive: boolean) =>
    cn(
      "text-sm font-semibold text-gray-900 hover:text-blue-500 border-b-2",
      isActive ? "border-blue-500" : "border-transparent"
    );

  const handleSignOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-5 font-bold">
          <Link to="/" className={className(isHome || isEvent)}>
            Daftar Acara
          </Link>

          <Link to="/organization" className={className(isOrganization)}>
            Organisasi
          </Link>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button onClick={handleSignOut} className="bg-red-100" size="sm">
            Keluar
            <LogOut />
          </Button>
        </div>
      </div>
    </div>
  );
}
