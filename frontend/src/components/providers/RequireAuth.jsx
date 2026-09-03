import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import { useCurrentUser } from "../../hooks/use-auth";

function RequireAuth({ children }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, user, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="auth-loading">
        <LoaderCircle
          size={26}
          className="loading-spinner"
        />

        <p>Loading your workspace...</p>
      </div>
    );
  }

  // Not authenticated
  if (isError || !user) {
    return null;
  }

  // Authenticated
  return children;
}

export default RequireAuth;
export { RequireAuth };