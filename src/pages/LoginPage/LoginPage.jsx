import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthField from "../../components/AuthField/AuthField";
import Button from "../../components/Button/Button";
import ProviderButton from "../../components/ProviderButton/ProviderButton";
import { AuthContext } from "../../context/AuthContext";
import "./LoginPage.css";

function extractError(err, fallback) {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export default function LoginPage() {
  const { login, loginWithProvider, completeProviderLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [twitchLoading, setTwitchLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");
    if (!token) return;
    (async () => {
      setSubmitting(true);
      try {
        await completeProviderLogin({ token, user });
        setSearchParams({}, { replace: true });
        navigate("/catalogue", {
          replace: true,
          state: { flash: { type: "success", message: "Logged in with Twitch." } },
        });
      } catch (err) {
        setError(extractError(err, "Twitch login failed."));
      } finally {
        setSubmitting(false);
      }
    })();
  }, [searchParams, completeProviderLogin, navigate, setSearchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(formData);
      navigate("/catalogue", {
        state: { flash: { type: "success", message: "Welcome back." } },
      });
    } catch (err) {
      setError(extractError(err, "Login failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTwitchLogin = async () => {
    setError("");
    setTwitchLoading(true);
    try {
      await loginWithProvider("TWITCH");
    } catch (err) {
      setError(extractError(err, "Could not start Twitch login."));
      setTwitchLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="authPage">
        <div className="authContainer">
          <h1 className="authTitle">Login</h1>
          <div className="authTitleUnderline" />
          <form className="authForm" onSubmit={handleSubmit} noValidate>
            <AuthField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <AuthField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <Link to="/forgot-password" className="authForgotLink">
              Forgotten your password?
            </Link>
            {error ? <p className="authError" role="alert">{error}</p> : null}
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "LOGGING IN…" : "LOGIN"}
            </Button>
            <div className="alt-signin">
              <p>Sign in alternatives:</p>
              <div className="site-icons">
                <ProviderButton
                  provider="TWITCH"
                  onClick={handleTwitchLogin}
                  disabled={submitting || twitchLoading}
                  loading={twitchLoading}
                />
              </div>
            </div>
            <Link to="/register" className="authSwitchLink">
              Create an account
            </Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}