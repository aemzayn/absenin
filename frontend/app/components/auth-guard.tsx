import { Building } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LOGIN_ROUTE } from "~/constants/routes";
import { useAuth } from "~/contexts/auth-contexts";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(LOGIN_ROUTE(), {
        replace: true,
      });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Building className="w-12 h-12 mx-auto text-blue-600 animate-pulse mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
