import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthField from "../components/AuthField/AuthField";
import Button from "../components/Button/Button";
import { AuthContext } from "../context/AuthContext";
import "../pages/LoginPage/LoginPage.css";

function extractError(err, fallback) {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export default function PWALoginPage() {
  const { login, completeProviderLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");
    if (!token) return;
    (async () => {
      setSubmitting(true);
      try {
        await completeProviderLogin({ token, user });
        setSearchParams({}, { replace: true });
        navigate("/", { replace: true });
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
      navigate("/", { replace: true });
    } catch (err) {
      setError(extractError(err, "Login failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          <a href="/forgot-password" className="authForgotLink">
            Forgotten your password?
          </a>
          {error ? <p className="authError" role="alert">{error}</p> : null}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "LOGGING IN…" : "LOGIN"}
          </Button>
          <a href="/register" className="authSwitchLink">
            Create an account
          </a>
        </form>
      </div>
    </main>
  );
}
