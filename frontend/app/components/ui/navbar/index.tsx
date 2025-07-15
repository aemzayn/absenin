import { Link, useMatch, useNavigate } from "react-router";
import { AuthService } from "~/services/auth.service";
import { LogOut } from "lucide-react";
import { Button } from "primereact/button";
import "./navbar.scss";

export default function Navbar() {
  const isHome = useMatch("/") != null;
  const isEvent = useMatch("/event/*") != null;
  const isOrganization = useMatch("/organization/*") != null;

  const navigate = useNavigate();

  const handleSignOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/">Daftar Acara</Link>
        <Link to="/organization">Organisasi</Link>
      </div>

      <div>
        <Button size="small" className="logout-button" onClick={handleSignOut}>
          Keluar
          <LogOut />
        </Button>
      </div>
    </div>
  );
}
