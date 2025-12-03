// src/pages/OrderSuccess.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CheckCircleFill, Truck } from "react-bootstrap-icons";

function OrderSuccess() {
  return (
    <Container className="py-5 text-center">
      <CheckCircleFill size={100} className="text-success mb-4" />
      <h1 className="text-success fw-bold mb-3">Order Placed Successfully!</h1>
      <p className="lead mb-4">Thank you for shopping with eMall Cambodia</p>
      <Truck size={60} className="text-success mb-4" />
      <p>Your order is being prepared and will be delivered soon.</p>
      <div className="mt-5">
        <Button as={Link} to="/products" variant="success" size="lg" className="mx-2 rounded-pill px-5">
          Continue Shopping
        </Button>
        <Button as={Link} to="/my-orders" variant="outline-success" size="lg" className="mx-2 rounded-pill">
          View Orders
        </Button>
      </div>
    </Container>
  );
}

export default OrderSuccess;