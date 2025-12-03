// src/pages/Verify.js
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Alert, Spinner, Button } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !emailParam) {
      setError("Invalid verification link.");
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.email.toLowerCase() === emailParam.toLowerCase());

    if (userIndex === -1) {
      setError("No account found for this email.");
      setLoading(false);
      return;
    }

    // Mark as verified
    users[userIndex].verified = true;
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess(true);
    setLoading(false);
    setTimeout(() => navigate("/login"), 3000);
  }, [token, emailParam, navigate]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f8fff9" }}>
        <Spinner animation="border" variant="success" size="lg" />
        <span className="ms-3 text-success fw-bold">Verifying your email...</span>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "#f8fff9" }}>
      <Container className="py-5">
        <Card className="mx-auto border-0 shadow-lg" style={{ maxWidth: "520px", borderRadius: "28px", overflow: "hidden" }}>
          {/* Header */}
          <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
            <h1 className="fw-bold display-5 mb-2">
              <FaCheckCircle className="me-3" size={38} />
              Email Verification
            </h1>
            <p className="mb-0 opacity-90">Almost there!</p>
          </div>

          <Card.Body className="p-5 text-center">
            {success ? (
              <Alert variant="success" className="rounded-4 d-flex align-items-center justify-content-center flex-column p-5">
                <FaCheckCircle className="mb-4" size={70} />
                <h3 className="fw-bold">Email Verified Successfully!</h3>
                <p className="text-muted mb-0">You can now log in to your account.</p>
                <small className="text-success mt-3">Redirecting to login in 3 seconds...</small>
              </Alert>
            ) : (
              <Alert variant="danger" className="rounded-4 d-flex align-items-center justify-content-center flex-column p-5">
                <FaExclamationCircle className="mb-4" size={70} />
                <h3 className="fw-bold">Verification Failed</h3>
                <p className="text-muted mb-0">{error}</p>
                <Button href="/register" variant="outline-success" className="mt-3 rounded-pill px-4">
                  Try Registering Again
                </Button>
              </Alert>
            )}
          </Card.Body>
        </Card>

        <div className="text-center mt-4 text-success">
          <small>© 2025 EMALL Cambodia • Secure & Trusted</small>
        </div>
      </Container>
    </div>
  );
}

export default Verify;