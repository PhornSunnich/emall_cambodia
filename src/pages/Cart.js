// src/pages/Cart.js
import React from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Fixed icons — these 100% exist in react-bootstrap-icons
import { Trash3Fill, PlusLg, DashLg } from "react-bootstrap-icons";

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useApp();

  if (cartCount === 0) {
    return (
      <Container className="my-5 py-5 text-center">
        <h2 className="text-muted">Your cart is empty</h2>
        <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 mt-3">
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center fw-bold text-success">
        Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
      </h2>

      <Row className="g-4">
        {/* Cart Items */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <ListGroup variant="flush">
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="p-4">
                  <Row className="align-items-center text-center text-md-start">
                    <Col xs={3} md={2}>
                      <Image
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.name}
                        rounded
                        className="img-fluid"
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </Col>

                    <Col xs={6} md={4}>
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <small className="text-muted">{item.category || "Product"}</small>
                    </Col>

                    {/* Quantity */}
                    <Col xs={6} md={3} className="mt-3 mt-md-0">
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <DashLg />
                        </Button>
                        <span className="fw-bold mx-2">{item.quantity || 1}</span>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          <PlusLg />
                        </Button>
                      </div>
                    </Col>

                    {/* Price */}
                    <Col xs={6} md={2} className="text-end text-md-center mt-3 mt-md-0">
                      <strong className="text-success fs-5">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </strong>
                    </Col>

                    {/* Delete */}
                    <Col xs={3} md={1} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash3Fill />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: "100px" }}>
            <Card.Header className="bg-success text-white text-center py-3">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body className="pt-4">
              <div className="d-flex justify-content-between py-2">
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 text-success">
                <span>Delivery Fee</span>
                <strong>FREE</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between py-3">
                <h4 className="fw-bold">Total</h4>
                <h4 className="text-success fw-bold fs-3">${cartTotal.toFixed(2)}</h4>
              </div>

              <Button
                as={Link}
                to="/checkout"
                variant="success"
                size="lg"
                className="w-100 rounded-pill py-3 fw-bold shadow-lg"
              >
                Proceed to Checkout
              </Button>

              <div className="text-center mt-3">
                <Link to="/products" className="text-muted small">
                  ← Continue Shopping
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      </Container>
    );
}

export default Cart;