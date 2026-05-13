import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthField from "../../components/AuthField/AuthField";
import Button from "../../components/Button/Button";
import "../LoginPage/LoginPage.css";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    console.log("Register attempt:", formData);
    // navigate("/login");
  };

  return (
    <>
      <Navbar />
      <main className="authPage">
        <div className="authContainer">
          <h1 className="authTitle">Create an account</h1>
          <div className="authTitleUnderline" />

          <form className="authForm" onSubmit={handleSubmit} noValidate>
            <div className="authFieldRow">
              <AuthField
                label="First name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
              <AuthField
                label="Last name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>

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
              autoComplete="new-password"
              required
            />

            <Button type="submit" variant="primary">
              CREATE ACCOUNT
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