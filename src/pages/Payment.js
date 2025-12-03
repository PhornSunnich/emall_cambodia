// src/pages/Payment.js
import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CheckCircleFill, Wallet2, CashCoin } from "react-bootstrap-icons";

function Payment() {
  const { cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [method, setMethod] = useState("aba");
  const [paid, setPaid] = useState(false);

  const handlePayment = () => {
    setPaid(true);
    clearCart();
    setTimeout(() => navigate("/order-success"), 3000);
  };

  if (paid) {
    return (
      <Container className="py-5 text-center">
        <CheckCircleFill size={90} className="text-success mb-4" />
        <h2 className="text-success fw-bold">Payment Successful!</h2>
        <p className="lead">Thank you! Your order is confirmed.</p>
        <p className="text-muted">Redirecting to your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 fw-bold text-success">Payment Method</h2>

      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Total */}
          <Card className="text-center mb-4 border-0 shadow">
            <Card.Body className="py-4">
              <small className="text-muted">Total Amount</small>
              <h1 className="text-success fw-bold mb-0">${cartTotal.toFixed(2)}</h1>
            </Card.Body>
          </Card>

          {/* ABA Pay */}
          <Card
            className={`mb-3 border-3 ${method === "aba" ? "border-success shadow-lg" : "border-light"}`}
            onClick={() => setMethod("aba")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3">
                <Wallet2 size={50} className="text-primary" />
                <div className="flex-grow-1">
                  <h5 className="mb-1">ABA Pay / KHQR</h5>
                  <small className="text-muted">Scan with ABA Mobile App</small>
                </div>
                {method === "aba" && <Badge bg="success">Selected</Badge>}
              </div>
              {method === "aba" && (
                <div className="text-center mt-4">
                  <Image
                    src="/qr/aba-qr.jpg"  // ← Put your real QR in public/qr/aba-qr.jpg
                    rounded
                    style={{ width: "220px", height: "220px" }}
                    alt="ABA QR Code"
                  />
                  <p className="mt-3 text-muted small">
                    Account: eMall Cambodia<br />
                    Phone: 010 888 999
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Acleda */}
          <Card
            className={`mb-3 border-3 ${method === "acleda" ? "border-success shadow-lg" : "border-light"}`}
            onClick={() => setMethod("acleda")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning rounded-3 p-2">
                  <strong style={{ fontSize: "1.8rem", color: "white" }}>A</strong>
                </div>
                <div>
                  <h5 className="mb-1">ACLEDA Bank</h5>
                  <small className="text-muted">Scan with ACLEDA Mobile</small>
                </div>
                {method === "acleda" && <Badge bg="success">Selected</Badge>}
              </div>
              {method === "acleda" && (
                <div className="text-center mt-4">
                  <Image
                    src="/qr/acleda-qr.jpg"  // ← Put your ACLEDA QR here
                    rounded
                    style={{ width: "220px", height: "220px" }}
                    alt="ACLEDA QR"
                  />
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Wing */}
          <Card
            className={`mb-4 border-3 ${method === "wing" ? "border-success shadow-lg" : "border-light"}`}
            onClick={() => setMethod("wing")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-danger text-white rounded-3 p-2">
                  <strong style={{ fontSize: "1.8rem" }}>W</strong>
                </div>
                <div>
                  <h5 className="mb-1">Wing Pay</h5>
                  <small className="text-muted">Fast payment with Wing</small>
                </div>
                {method === "wing" && <Badge bg="success">Selected</Badge>}
              </div>
              {method === "wing" && (
                <div className="text-center mt-4">
                  <Image
                    src="/qr/wing-qr.jpg"  // ← Put your Wing QR here
                    rounded
                    style={{ width: "220px", height: "220px" }}
                    alt="Wing QR"
                  />
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Cash on Delivery */}
          <Card
            className={`mb-4 border-3 ${method === "cod" ? "border-success shadow-lg" : "border-light"}`}
            onClick={() => setMethod("cod")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="p-4 text-center">
              <CashCoin size={60} className="text-success mb-3" />
              <h5>Cash on Delivery</h5>
              <small className="text-muted">Pay when you receive your order</small>
            </Card.Body>
          </Card>

          <Button
            variant="success"
            size="lg"
            className="w-100 rounded-pill py-3 fw-bold"
            onClick={handlePayment}
          >
            Confirm Order & Pay ${cartTotal.toFixed(2)}
          </Button>

          <div className="text-center mt-3">
            <Link to="/checkout" className="text-muted small">
              ← Back to Checkout
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Payment;