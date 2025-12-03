// src/pages/MyOrders.js
import React from "react";
import { Container, Card, Badge, ListGroup, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Truck, Clock, CheckCircle } from "react-bootstrap-icons";

function MyOrders() {
  const orders = JSON.parse(localStorage.getItem("emall_orders") || "[]");

  if (orders.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-muted mb-4">No orders yet</h2>
        <Link to="/products" className="btn btn-success rounded-pill px-5 py-3">Start Shopping</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 fw-bold text-success fs-1">My Orders</h2>

      {orders.map((order) => (
        <Card key={order.id} className="mb-4 shadow-sm border-0 rounded-4">
          <Card.Header className="bg-light border-0 py-3">
            <Row className="align-items-center">
              <Col>
                <strong>Order #{order.id}</strong><br />
                <small className="text-muted">
                  <Clock className="me-1" /> {order.date} • {order.time}
                </small>
              </Col>
              <Col className="text-end">
                <Badge bg={order.status === "Paid" ? "success" : "warning"} className="fs-6">
                  {order.status === "Paid" ? <CheckCircle className="me-1" /> : <Truck className="me-1" />}
                  {order.status}
                </Badge>
              </Col>
            </Row>
          </Card.Header>

          <ListGroup variant="flush">
            {order.items.slice(0, 3).map((item, i) => (
              <ListGroup.Item key={i} className="py-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{item.name}</strong> × {item.quantity || 1}
                  </div>
                  <span className="text-success">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              </ListGroup.Item>
            ))}
            {order.items.length > 3 && (
              <ListGroup.Item className="text-muted text-center">
                + {order.items.length - 3} more items
              </ListGroup.Item>
            )}
          </ListGroup>

          <Card.Footer className="bg-success text-white py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Total: ${order.total}</strong><br />
                <small>Paid via {order.method}</small>
              </div>
              <Badge bg="white" text="success" className="fs-6 px-4 py-2">
                View Details
              </Badge>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
}

export default MyOrders;