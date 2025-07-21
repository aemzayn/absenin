import { Link, useMatch, useNavigate } from "react-router";
import { AuthService } from "~/services/auth.service";
import { LogOut } from "lucide-react";
import { Button } from "primereact/button";
import { ORGANIZATION_ROUTE, HOME_ROUTE } from "~/constants/routes";
import "./navbar.scss";

export default function Navbar() {
  const isHome = useMatch("/") != null;
  const isOrganization = useMatch("/organization/*") != null;

  const navigate = useNavigate();

  const handleSignOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to={HOME_ROUTE()} className={isHome ? "active" : ""}>
          Daftar Acara
        </Link>
        <Link
          to={ORGANIZATION_ROUTE()}
          className={isOrganization ? "active" : ""}
        >
          Yayasan
        </Link>
      </div>

      <div>
        <Button
          size="small"
          className="logout-button"
          onClick={handleSignOut}
          label="Keluar"
          icon={<LogOut />}
          iconPos="right"
        />
      </div>
    </div>
  );
}
