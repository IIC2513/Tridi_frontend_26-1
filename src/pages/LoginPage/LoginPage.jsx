import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthField from "../../components/AuthField/AuthField";
import Button from "../../components/Button/Button";
import "./LoginPage.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // navigate("/account");
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
              label="Email address"
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

            <Button type="submit" variant="primary">
              LOGIN
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