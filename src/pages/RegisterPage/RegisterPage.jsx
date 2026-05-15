import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthField from "../../components/AuthField/AuthField";
import Button from "../../components/Button/Button";
import { AuthContext } from "../../context/AuthContext";
import "../LoginPage/LoginPage.css";
import "./RegisterPage.css";

function extractError(err, fallback) {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      await register({
        ...formData,
        username: formData.email.split("@")[0],
      });
      navigate("/catalogue", {
        state: {
          flash: {
            type: "success",
            title: "ACCOUNT CREATED",
            message: "Welcome to Tridi.",
          },
        },
      });
    } catch (err) {
      setError(extractError(err, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="authPage">
        <div className="authContainer">
          <h1 className="authTitle">Create an account</h1>
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
              autoComplete="new-password"
              required
            />
            {error ? <p className="authError" role="alert">{error}</p> : null}
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "CREATING…" : "CREATE ACCOUNT"}
            </Button>
            <Link to="/login" className="authSwitchLink">
              Got an account?
            </Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}