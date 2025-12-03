// src/components/Logout.js  (or src/pages/Logout.js)
import React, { useEffect } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSignOutAlt } from "react-icons/fa";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all user data
    localStorage.removeItem("currentUser");

    // Optional: Clear remembered email on logout (recommended for security)
    // localStorage.removeItem("rememberedEmail");

    // Show logout for 1.5 seconds then redirect
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "#f8fff9" }}>
      <Container className="py-5">
        <Card className="mx-auto border-0 shadow-lg text-center" style={{ maxWidth: "480px", borderRadius: "28px", overflow: "hidden" }}>
          {/* Header */}
          <div className="text-white py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
            <FaSignOutAlt size={48} className="mb-3" />
            <h1 className="fw-bold display-5 mb-2">See You Soon!</h1>
            <p className="mb-0 opacity-90">You have been logged out securely</p>
          </div>

          <Card.Body className="p-5">
            <Alert variant="success" className="rounded-4 d-flex align-items-center justify-content-center">
              <FaCheckCircle size={28} className="me-3" />
              <div>
                <strong>Logged out successfully!</strong>
                <br />
                <small>Your session has been ended safely.</small>
              </div>
            </Alert>

            <div className="mt-4">
              <Spinner animation="border" variant="success" className="me-3" />
              <span className="text-success fw-bold">Redirecting to login...</span>
            </div>

            <div className="mt-4 text-muted small">
              Thank you for using <strong>EMALL Cambodia</strong>
            </div>
          </Card.Body>

          <div className="bg-light py-3">
            <small className="text-success">© 2025 EMALL Cambodia • Secure Logout</small>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default Logout;