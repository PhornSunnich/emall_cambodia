// src/pages/Payment.js
import React, { useState } from "react";
import { Container, Card, Row, Col, Image, Badge, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CheckCircleFill, Wallet2, CashCoin } from "react-bootstrap-icons";

const methods = [
  { id: "aba",    name: "ABA Pay / KHQR",   color: "#0061a8", qr: "/qr/aba-qr.jpg",    info: "eMall Cambodia • 010 888 999" },
  { id: "acleda", name: "ACLEDA Bank",      color: "#f9a825", qr: "/qr/acleda-qr.jpg" },
  { id: "wing",   name: "Wing Pay",         color: "#d32f2f", qr: "/qr/wing-qr.jpg" },
  { id: "cod",    name: "Cash on Delivery", color: "#2e7d32", icon: <CashCoin size={36} /> },
];

function Payment() {
  const { cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("aba");
  const [paid, setPaid] = useState(false);

  const total = Number(cartTotal).toFixed(2);

  const handlePay = () => {
    // Save order to history (we'll use this in My Orders)
    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB"),
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      items: JSON.parse(localStorage.getItem("emall_cart") || "[]"),
      total: total,
      method: methods.find(m => m.id === selected)?.name || "Unknown",
      status: selected === "cod" ? "Pending" : "Paid",
    };
    const history = JSON.parse(localStorage.getItem("emall_orders") || "[]");
    history.unshift(order);
    localStorage.setItem("emall_orders", JSON.stringify(history));

    setPaid(true);
    clearCart();
    setTimeout(() => navigate("/order-success"), 2500);
  };

  if (paid) {
    return (
      <Container className="py-5 text-center">
        <CheckCircleFill size={110} className="text-success mb-4" />
        <h1 className="text-success fw-bold mb-3">Payment Successful!</h1>
        <p className="lead text-muted">Thank you for your order!</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 fw-bold text-success fs-1">Payment Method</h2>

      {/* Total */}
      <Row className="justify-content-center mb-5">
        <Col md={6}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body className="py-5 bg-success text-white rounded-4">
              <small className="d-block mb-2">Total Amount</small>
              <h1 className="display-3 fw-bold mb-0">${total}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center g-4">
        <Col lg={8}>
          {methods.map((m) => (
            <Card
              key={m.id}
              className={`border-0 shadow-sm mb-4 ${selected === m.id ? "border-success border-4" : ""}`}
              style={{ borderRadius: "20px", cursor: "pointer" }}
              onClick={() => setSelected(m.id)}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-4">
                    {m.icon ? m.icon : (
                      <div className="rounded-4 text-white d-flex align-items-center justify-content-center shadow" style={{ width: 70, height: 70, background: m.color, fontSize: "2.2rem", fontWeight: "900" }}>
                        {m.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="mb-0 fw-bold">{m.name}</h4>
                      {m.id === "cod" && <small className="text-success">Pay when you receive</small>}
                    </div>
                  </div>
                  {selected === m.id && <Badge bg="success" className="fs-6 px-4 py-2">Selected</Badge>}
                </div>

                {m.qr && selected === m.id && (
                  <div className="text-center mt-4 p-4 bg-white rounded-4 shadow">
                    <Image src={m.qr} width={260} height={260} className="rounded-3 shadow-sm" />
                    {m.info && <p className="mt-3 fw-bold fs-5">{m.info}</p>}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}

          <Button variant="success" size="lg" className="w-100 rounded-pill py-4 fw-bold fs-4 shadow" onClick={handlePay}>
            Confirm & Pay ${total}
          </Button>

          <div className="text-center mt-3">
            <Link to="/checkout" className="text-muted">Back to Checkout</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Payment;