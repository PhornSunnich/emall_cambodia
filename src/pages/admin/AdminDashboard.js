// src/pages/admin/AdminDashboard.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Nav, Navbar, Button, Badge } from "react-bootstrap";
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const adminMenu = [
  { icon: FaHome, label: "Dashboard", path: "/admin" },
  { icon: FaBox, label: "Products", path: "/admin/products" },
  { icon: FaUsers, label: "Users", path: "/admin/users" },
  { icon: FaShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: FaChartBar, label: "Analytics", path: "/admin/analytics" },
  { icon: FaCog, label: "Settings", path: "/admin/settings" },
  
];

function AdminDashboard() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fake stats
  const stats = {
    totalRevenue: "$48,574",
    totalOrders: 1234,
    totalProducts: 892,
    totalUsers: 5678,
    pendingOrders: 23,
  };

  if (!user || user.email !== "admin@emall.com") {
    return (
      <Container className="text-center my-5">
        <h1 className="text-danger">Access Denied</h1>
        <p>You must be admin to access this page.</p>
        <Button variant="success" onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-3">
            eMall Admin
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">Welcome, Admin</span>
            <Button variant="outline-light" size="sm" onClick={logout}>
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="bg-white shadow-lg" style={{ minHeight: "calc(100vh - 76px)" }}>
          <Nav className="flex-column pt-4">
            {adminMenu.map((item) => (
              <Nav.Link
                key={item.path}
                className={`px-4 py-3 text-dark fw-semibold d-flex align-items-center gap-3 ${
                  activeTab === item.path.split("/").pop() ? "bg-success text-white" : "hover-bg-success"
                }`}
                onClick={() => {
                  setActiveTab(item.path.split("/").pop());
                  navigate(item.path);
                }}
                style={{ transition: "all 0.3s" }}
              >
                <item.icon size={20} />
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-5">
          <h2 className="text-success fw-bold mb-4">Dashboard Overview</h2>

          {/* Stats Cards */}
          <Row className="g-4 mb-5">
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-success text-white p-3 rounded-circle me-4">
                    <FaShoppingCart size={30} />
                  </div>
                  <div>
                    <h5 className="text-muted">Total Revenue</h5>
                    <h3 className="fw-bold text-success">{stats.totalRevenue}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-primary text-white p-3 rounded-circle me-4">
                    <FaBox size={30} />
                  </div>
                  <div>
                    <h5 className="text-muted">Total Orders</h5>
                    <h3 className="fw-bold">{stats.totalOrders}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-warning text-white p-3 rounded-circle me-4">
                    <FaBox size={30} />
                  </div>
                  <div>
                    <h5 className="text-muted">Products</h5>
                    <h3 className="fw-bold">{stats.totalProducts}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-info text-white p-3 rounded-circle me-4">
                    <FaUsers size={30} />
                  </div>
                  <div>
                    <h5 className="text-muted">Total Users</h5>
                    <h3 className="fw-bold">{stats.totalUsers}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Pending Orders Alert */}
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">Pending Orders</h4>
                  <p className="text-muted">You have {stats.pendingOrders} orders waiting for approval</p>
                </div>
                <Button variant="success" size="lg" className="px-5">
                  View Orders <Badge bg="danger" className="ms-2">{stats.pendingOrders}</Badge>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;