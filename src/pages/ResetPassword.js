// src/pages/ResetPassword.js
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check token on load
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset link. Please request a new one.");
    } else {
      // Optional: verify token with backend here in real app
      // For now, we accept any non-empty token (you'll secure this later)
      if (token.length < 10) {
        setError("Invalid reset link.");
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // In a real app: send { token, newPassword } to your backend
      // For now: simulate with localStorage + token check
      const resetRequests = JSON.parse(localStorage.getItem("passwordResets") || "[]");
      const validRequest = resetRequests.find(r => r.token === token && Date.now() < r.expiresAt);

      if (!validRequest) {
        setError("This reset link is invalid or has expired.");
        setLoading(false);
        return;
      }

      // Update user's password
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.email === validRequest.email);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Clean up used token
      const updatedRequests = resetRequests.filter(r => r.token !== token);
      localStorage.setItem("passwordResets", JSON.stringify(updatedRequests));

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || error.includes("Invalid")) {
    return (
      <div className="min-vh-100 d-flex align-items-center bg-light">
        <Container className="text-center py-5">
          <Card className="mx-auto p-5" style={{ maxWidth: "500px" }}>
            <FaExclamationCircle size={60} className="text-danger mb-4" />
            <h2>Invalid Reset Link</h2>
            <p className="text-muted">{error || "This link is not valid or has expired."}</p>
            <Button href="/forgot-password" variant="success" className="rounded-pill px-4">
              Request New Link
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "#f8fff9" }}>
      <Container className="py-5">
        <Card className="mx-auto border-0 shadow-lg" style={{ maxWidth: "500px", borderRadius: "28px", overflow: "hidden" }}>
          <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
            <h1 className="fw-bold display-5 mb-2">
              <FaLock className="me-3" size={38} />
              Reset Password
            </h1>
            <p className="mb-0 opacity-90">Create your new secure password</p>
          </div>

          <Card.Body className="p-5">
            {success ? (
              <Alert variant="success" className="text-center rounded-4">
                <FaCheckCircle size={28} className="mb-3" />
                <h5>Password Changed Successfully!</h5>
                <p>Redirecting to login...</p>
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="danger" className="rounded-4">
                    <FaExclamationCircle className="me-2" /> {error}
                  </Alert>
                )}

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-success">New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="py-3 px-4 rounded-pill border-success"
                      style={{ backgroundColor: "#f0fff4", paddingRight: "60px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-success pe-3"
                    >
                      {showNew ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-success">Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="py-3 px-4 rounded-pill border-success"
                      style={{ backgroundColor: "#f0fff4", paddingRight: "60px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-success pe-3"
                    >
                      {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100 rounded-pill py-3 fw-bold text-white border-0 shadow-lg"
                  style={{
                    background: loading ? "#0f662f" : "linear-gradient(135deg, #1DB954, #0f662f)",
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Updating Password...
                    </>
                  ) : (
                    "Set New Password"
                  )}
                </Button>
              </Form>
            )}

            <div className="text-center mt-4">
              <small className="text-muted">
                <a href="/login" className="text-success text-decoration-none">Back to Login</a>
              </small>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4 text-success">
          <small>© 2025 EMALL Cambodia • Secure & Fast</small>
        </div>
      </Container>
    </div>
  );
}