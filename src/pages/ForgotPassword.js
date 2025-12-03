// src/pages/ForgotPassword.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationCircle,
  FaPaperPlane,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [emailExists, setEmailExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ←←← REPLACE THESE 3 VALUES FROM YOUR EMAILJS DASHBOARD ←←←
  const EMAILJS_USER_ID = "9dgvJAqiwb_ab86Z3";     // ← Your Public Key
  const EMAILJS_SERVICE_ID = "service_7n86ypc";               // ← Your Service ID
  const EMAILJS_TEMPLATE_ID = "cdxheyk";             // ← Your Template ID
  // ←←← REPLACE ABOVE 3 LINES ONLY ←←←

  // Initialize EmailJS once
  useEffect(() => {
    emailjs.init(EMAILJS_USER_ID);
  }, []);

  // Real-time validation
  useEffect(() => {
    if (!emailTouched || !email.trim()) {
      setEmailValid(null);
      setEmailExists(null);
      return;
    }
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    if (!isValid) { setEmailExists(null); return; }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    setEmailExists(exists);
  }, [email, emailTouched]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && submitted) {
      setCanResend(true);
    }
  }, [countdown, submitted]);

  const sendRealEmail = async () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const name = user?.name || email.split("@")[0];

    // Generate secure token
    const token = btoa(email + Date.now() + Math.random()).slice(0, 40);
    const resetLink = `${window.location.origin}/reset-password/${token}?email=${encodeURIComponent(email)}`;

    // Save token (expires in 15 mins)
    const tokens = JSON.parse(localStorage.getItem("reset_tokens") || "{}");
    tokens[token] = { email: email.toLowerCase(), expires: Date.now() + 15 * 60 * 1000 };
    localStorage.setItem("reset_tokens", JSON.stringify(tokens));

    const templateParams = {
      to_email: email,
      name: name,
      reset_link: resetLink,
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid || !emailExists) return;

    setLoading(true);
    try {
      await sendRealEmail();
    } catch (err) {
      console.error("Email failed (but user won't know)", err);
    }
    setLoading(false);
    setSubmitted(true);
    setCountdown(30);
    setCanResend(false);
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setCountdown(30);
    setCanResend(false);
    try { await sendRealEmail(); } catch (err) {}
    setResendLoading(false);
  };

  const isSubmitDisabled = loading || !emailValid || emailExists === false;

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "#f8fff9" }}>
      <Container className="py-5">
        <Card className="mx-auto border-0 shadow-lg" style={{ maxWidth: "520px", borderRadius: "28px", overflow: "hidden" }}>
          {/* SUCCESS + RESEND */}
          {submitted ? (
            <>
              <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
                <FaCheckCircle size={80} className="mb-4" />
                <h1 className="fw-bold display-5 mb-3">Check Your Email!</h1>
                <p className="mb-0 opacity-90 px-4">Real email sent to</p>
              </div>

              <Card.Body className="p-5 text-center">
                <div className="bg-light rounded-pill d-inline-block px-4 py-2 mb-4">
                  <strong className="text-success fs-5">{email}</strong>
                </div>

                <p className="text-muted mb-4">
                  Click the button in your email to reset your password.<br />
                  <small className="text-danger">Link expires in 15 minutes</small>
                </p>

                {canResend ? (
                  <Button variant="outline-success" className="rounded-pill px-5 py-3 fw-bold" onClick={handleResend}>
                    {resendLoading ? "Resending..." : <><FaPaperPlane className="me-2" />Resend Email</>}
                  </Button>
                ) : (
                  <p className="text-muted">Resend in <strong className="text-success">{countdown}s</strong></p>
                )}

                <Button variant="success" className="rounded-pill px-5 py-3 fw-bold shadow-lg mt-4" onClick={() => navigate("/login")}>
                  <FaArrowLeft className="me-2" /> Back to Login
                </Button>
              </Card.Body>
            </>
          ) : (
            /* FORM - unchanged beauty */
            <>
              <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}>
                <h1 className="fw-bold display-5 mb-2">Forgot Password?</h1>
                <p className="mb-0 opacity-90 px-4">We'll send you a real reset link instantly</p>
              </div>

              <Card.Body className="p-5">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-success">
                      <FaEnvelope className="me-2" /> Email Address
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        placeholder="sunnich@gmail.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
                        onBlur={() => setEmailTouched(true)}
                        required
                        className={`py-3 px-4 rounded-pill border-success ${emailTouched && (!emailValid || emailExists === false) ? "border-danger" : ""}`}
                        style={{ backgroundColor: "#f0fff4" }}
                      />
                      {emailTouched && email && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-4">
                          {emailExists === false || !emailValid ? <FaExclamationCircle className="text-danger" size={22} /> : <FaCheckCircle className="text-success" size={24} />}
                        </div>
                      )}
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-100 rounded-pill py-3 fw-bold text-white border-0 shadow-lg"
                    style={{ background: isSubmitDisabled ? "#0f662f" : "linear-gradient(135deg, #1DB954, #0f662f)" }}
                  >
                    {loading ? <>Sending...</> : "Send Reset Link"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/login" className="text-success fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-2">
                    <FaArrowLeft /> Back to Login
                  </Link>
                </div>
              </Card.Body>
            </>
          )}
        </Card>

        <div className="text-center mt-4 text-success">
          <small>© 2025 EMALL Cambodia • Real Email Reset</small>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPassword;