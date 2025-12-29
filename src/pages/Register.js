// src/pages/Register.js
import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Image,
  Spinner,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useApp } from "../context/AppContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation States
  const [emailValid, setEmailValid] = useState(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useApp(); // For instant login after register

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name.trim() || "User"
  )}&background=1DB954&color=fff&bold=true&size=256&rounded=true&font-size=0.4`;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Email Validation
  useEffect(() => {
    if (!emailTouched || !email) {
      setEmailValid(null);
      setEmailTaken(false);
      return;
    }
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    if (!isValid) {
      setEmailTaken(false);
      return;
    }
    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    setEmailTaken(exists);
  }, [email, emailTouched]);

  // Password Strength
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    setStrength((score / 5) * 100);

    if (score <= 2) {
      setStrengthLabel("Weak");
      setStrengthColor("#dc3545");
    } else if (score === 3) {
      setStrengthLabel("Fair");
      setStrengthColor("#ffc107");
    } else if (score === 4) {
      setStrengthLabel("Good");
      setStrengthColor("#1DB954");
    } else if (score === 5) {
      setStrengthLabel("Strong");
      setStrengthColor("#17a34a");
    } else {
      setStrengthLabel("");
      setStrengthColor("");
    }
  }, [password]);

  // Password Match
  useEffect(() => {
    if (!confirmPassword || !password) {
      setPasswordsMatch(null);
      return;
    }
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large! Max 5MB allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (!emailValid || emailTaken) {
      setError("Please use a valid and unique email address.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (strength < 80) {
      setError("Password must be Good or Strong.");
      setLoading(false);
      return;
    }

    // Save user
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase(),
      password: password,
      avatar: avatar || null,
      createdAt: new Date().toISOString(),
      // No more verified field → instant access
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto login
    login(newUser);

    setSuccess("Account created successfully! Welcome to EMALL");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1800);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: "#f8fff9" }}
    >
      <Container className="py-5">
        <Card
          className="mx-auto border-0 shadow-lg"
          style={{
            maxWidth: "520px",
            borderRadius: "28px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="text-white text-center py-5"
            style={{ background: "linear-gradient(135deg, #1DB954, #17a34a)" }}
          >
            <h1 className="fw-bold display-5 mb-2">Create Account</h1>
            <p className="mb-0 opacity-90">Join EMALL Cambodia Today</p>
          </div>

          <Card.Body className="p-5">
            {error && (
              <Alert
                variant="danger"
                className="rounded-4 d-flex align-items-center"
              >
                <FaExclamationCircle className="me-2" size={20} />
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="rounded-4 text-center">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleRegister}>
              {/* Avatar Upload */}
              <div className="text-center mb-5">
                <div className="position-relative d-inline-block">
                  <Image
                    src={preview || defaultAvatar}
                    roundedCircle
                    width={130}
                    height={130}
                    alt="Avatar"
                    className="border border-5 border-white shadow"
                    style={{ objectFit: "cover" }}
                  />
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Upload Photo</Tooltip>}
                  >
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                      style={{
                        width: "46px",
                        height: "46px",
                        cursor: "pointer",
                        border: "4px solid white",
                      }}
                    >
                      <FaCamera size={22} />
                    </div>
                  </OverlayTrigger>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <p className="text-muted mt-3 small">
                  Click to upload photo (optional)
                </p>
              </div>

              {/* Full Name */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-success">
                  <FaUser className="me-2" /> Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phorn Sunnich"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="py-3 px-4 rounded-pill border-success"
                  style={{ backgroundColor: "#f0fff4" }}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-success">
                  <FaEnvelope className="me-2" /> Email Address
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="email"
                    placeholder="phornsunnich@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    required
                    className={`py-3 px-4 rounded-pill border-success ${
                      emailTouched && (emailValid === false || emailTaken)
                        ? "border-danger"
                        : ""
                    }`}
                    style={{ backgroundColor: "#f0fff4" }}
                  />
                  {emailTouched && email && (
                    <div className="position-absolute end-0 top-50 translate-middle-y pe-4">
                      {emailTaken ? (
                        <FaExclamationCircle
                          className="text-danger"
                          size={20}
                        />
                      ) : emailValid ? (
                        <FaCheckCircle className="text-success" size={20} />
                      ) : (
                        <FaExclamationCircle
                          className="text-danger"
                          size={20}
                        />
                      )}
                    </div>
                  )}
                </div>
                {emailTouched && email && (
                  <small className="d-block mt-2">
                    {emailTaken ? (
                      <span className="text-danger">
                        Email already registered
                      </span>
                    ) : !emailValid ? (
                      <span className="text-danger">Invalid email format</span>
                    ) : (
                      <span className="text-success">Looks good!</span>
                    )}
                  </small>
                )}
              </Form.Group>

              {/* Password */}
              {/* Password & Confirm Password - unchanged, eye icons fixed */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-success">
                  <FaLock className="me-2" /> Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-3 px-4 rounded-pill border-success"
                    style={{ backgroundColor: "#f0fff4", paddingRight: "70px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-success d-flex align-items-center justify-content-center"
                    style={{
                      zIndex: 10,
                      width: "50px",
                      height: "50px",
                      right: "10px",
                    }}
                  >
                    
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-success">
                  <FaLock className="me-2" /> Confirm Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`py-3 px-4 rounded-pill border-success ${
                      passwordsMatch === false ? "border-danger" : ""
                    }`}
                    style={{
                      backgroundColor: "#f0fff4",
                      paddingRight: "110px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="position-absolute top-50 translate-middle-y bg-transparent border-0 text-success d-flex align-items-center justify-content-center"
                    style={{
                      zIndex: 10,
                      width: "50px",
                      height: "50px",
                      right: "54px",
                    }}
                  >
                   
                  </button>
                  {confirmPassword && (
                    <div
                      className="position-absolute top-50 translate-middle-y"
                      style={{ right: "16px" }}
                    >
                      {passwordsMatch ? (
                        <FaCheckCircle className="text-success" size={23} />
                      ) : (
                        <FaExclamationCircle
                          className="text-danger"
                          size={23}
                        />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword && (
                  <small
                    className={`d-block mt-2 ${
                      passwordsMatch ? "text-success" : "text-danger"
                    }`}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </small>
                )}
              </Form.Group>

              {/* Strength Bar */}
              {password && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">Password Strength</small>
                    <strong style={{ color: strengthColor }}>
                      {strengthLabel}
                    </strong>
                  </div>
                  <ProgressBar
                    now={strength}
                    style={{ height: "10px", borderRadius: "10px" }}
                  >
                    <ProgressBar
                      animated
                      now={strength}
                      style={{ background: strengthColor }}
                    />
                  </ProgressBar>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  !emailValid ||
                  emailTaken ||
                  !passwordsMatch ||
                  strength < 80
                }
                className="w-100 rounded-pill py-3 fw-bold text-white border-0 shadow-lg"
                style={{
                  background:
                    loading ||
                    !emailValid ||
                    emailTaken ||
                    !passwordsMatch ||
                    strength < 80
                      ? "#0f662f"
                      : "linear-gradient(135deg, #1DB954, #0f662f)",
                }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating Account...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-success fw-bold text-decoration-none"
                >
                  Login here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4 text-success">
          <small>© 2025 EMALL Cambodia. All rights reserved.</small>
        </div>
      </Container>
    </div>
  );
}

export default Register;
