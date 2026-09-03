import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { GitHubIcon } from "../../components/icons/GitHubIcon";

import { BrandMark } from "../../components/layout/AppShell";
import { getGithubLoginUrl } from "../../lib/api";
import { useCurrentUser } from "../../hooks/use-auth";
import ModeToggle from "../../components/ui/ModeToggle";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useCurrentUser();

  // Read query parameters from the URL
  const params = new URLSearchParams(location.search);

  const error = params.get("error");
  const next = params.get("next") || "/dashboard";

  useEffect(() => {
    if (!isLoading && user) {
      const destination = next.startsWith("/")
        ? next
        : "/dashboard";

      navigate(destination, { replace: true });
    }
  }, [user, isLoading, next, navigate]);

  if (isLoading) {
    return (
      <div className="login-loading">
        <LoaderCircle
          size={30}
          className="loading-spinner"
        />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-background" />

      {/* Header */}
      <header className="login-header">
        <Link to="/" className="login-brand">
          <BrandMark />
        </Link>

        <ModeToggle />
      </header>

      {/* Login card */}
      <main className="login-main">
        <div className="login-card">

          <div className="login-card-header">
            <div className="github-logo">
              <GitHubIcon width={25} height={25} />
            </div>

            <h1>Sign in</h1>

            <p>
              Connect GitHub to chat with your repositories.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />

              <div>
                <strong>Sign-in failed</strong>
                <span>Please try again.</span>
              </div>
            </div>
          )}

          {/* GitHub login */}
          <a
            href={getGithubLoginUrl()}
            className="github-login-button"
          >
            <GitHubIcon width={19} height={19} />

            <span>Continue with GitHub</span>
          </a>

          <p className="login-footer-text">
            Your repositories stay connected through GitHub OAuth.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;