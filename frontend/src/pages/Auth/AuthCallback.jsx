import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import { useCurrentUser } from "../../hooks/use-auth";

function AuthCallback() {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isFetched,
  } = useCurrentUser();

  useEffect(() => {
    if (!isFetched || isLoading) {
      return;
    }

    if (user) {
      navigate("/dashboard", {
        replace: true,
      });
      return;
    }

    navigate("/login?error=session", {
      replace: true,
    });
  }, [
    user,
    isLoading,
    isFetched,
    navigate,
  ]);

  return (
    <div className="auth-callback">
      <LoaderCircle
        size={26}
        className="auth-callback-spinner"
      />

      <p>Finishing GitHub sign-in…</p>
    </div>
  );
}

export default AuthCallback;
export { AuthCallback };