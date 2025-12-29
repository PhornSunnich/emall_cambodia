// src/pages/Login.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import { useApp } from "../context/AppContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useApp();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError("No account found with this email.");
      setLoading(false);
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Try again.");
      setLoading(false);
      return;
    }

    // REMOVED: Email verification check (user.verified)

    // SUCCESSFUL LOGIN
    login(user);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setSuccess("Login successful! Welcome back!");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "#f8fff9" }}>
      <Container className="py-5">
        <Card className="mx-auto border-0 shadow-lg" style={{ maxWidth: "480px", borderRadius: "28px", overflow: "hidden" }}>
          {/* Header */}
          <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
            <h1 className="fw-bold display-5 mb-2">Welcome Back!</h1>
            <p className="mb-0 opacity-90">Log in to EMALL Cambodia</p>
          </div>

          <Card.Body className="p-5">
            {error && (
              <Alert variant="danger" className="rounded-4 d-flex align-items-center">
                <FaExclamationCircle className="me-2" size={20} />
                {error}
              </Alert>
            )}
            {success && <Alert variant="success" className="rounded-4">{success}</Alert>}

            <Form onSubmit={handleLogin}>
              {/* Email */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-success">
                  <FaEnvelope className="me-2" /> Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="phornsunnich@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-3 px-4 rounded-pill border-success"
                  style={{ backgroundColor: "#f0fff4" }}
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-success">
                  <FaLock className="me-2" /> Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="py-3 px-4 rounded-pill border-success"
                    style={{ backgroundColor: "#f0fff4", paddingRight: "70px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-success d-flex align-items-center justify-content-center"
                    style={{ zIndex: 10, width: "50px", height: "50px", right: "10px" }}
                  >
                    
                  </button>
                </div>
              </Form.Group>

              {/* Remember Me + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="text-success small"
                  style={{ cursor: "pointer" }}
                />
                <Link to="/forgot-password" className="text-success small fw-bold text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-100 rounded-pill py-3 fw-bold text-white border-0 shadow-lg"
                style={{
                  background: loading ? "#0f662f" : "linear-gradient(135deg, #1DB954, #0f662f)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Logging in...
                  </>
                ) : (
                  "Login Now"
                )}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-success fw-bold text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4 text-success">
          <small>© 2025 EMALL Cambodia • Secure Login</small>
        </div>
      </Container>
    </div>
  );
}

export default Login;