import { Link, useMatch } from "react-router";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

export default function Navbar() {
  const isHome = useMatch("/") != null;
  const isEvent = useMatch("/event") != null;
  const isOrganization = useMatch("/organization") != null;

  const className = (isActive: boolean) =>
    cn(
      "text-sm font-semibold text-gray-900 hover:text-blue-500 border-b-2",
      isActive ? "border-blue-500" : "border-transparent"
    );

  return (
    <div className="">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-5 font-bold">
          <Link to="/" className={className(isHome)}>
            HOME
          </Link>

          <Link to="/event" className={className(isEvent)}>
            EVENTS
          </Link>

          <Link to="/organization" className={className(isOrganization)}>
            ORGANIZATION
          </Link>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button>SIGN OUT</Button>
        </div>
      </div>
    </div>
  );
}
