import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthField from "../../components/AuthField/AuthField";
import Button from "../../components/Button/Button";
import { AuthContext } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      navigate("/account");
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Login failed.");
    } finally {
      setSubmitting(false);
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
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
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