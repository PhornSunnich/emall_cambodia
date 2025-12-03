// src/pages/Stores.js 
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  InputGroup,
  Button,
  Badge,
  Card,
  Stack,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Helmet } from "react-helmet";
import { StarFill } from "react-bootstrap-icons";

function Stores() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [totalStores, setTotalStores] = useState(0);

  const limit = 12;

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (currentPage > 1) params.set("page", currentPage);
    navigate(`/stores?${params.toString()}`, { replace: true });
  }, [searchQuery, selectedCategory, currentPage, navigate]);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit, page: currentPage });
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);

        const res = await api.get(`/stores?${params.toString()}`);
        const data = res.data;

        setStores(data.stores || []);
        setTotalStores(data.pagination?.total || data.stores?.length || 0);
      } catch (err) {
        console.error(err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [currentPage, searchQuery, selectedCategory]);

  const categories = [
    "Electronics", "Fashion", "Beauty", "Home & Living",
    "Sports", "Food & Beverage", "Health", "Supermarket"
  ];

  // ★★★★★ Perfect StoreCard (built-in)
  const StoreCard = ({ store }) => (
    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition-all">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={store.cover_image || "https://via.placeholder.com/400x200/198754/ffffff?text=Store+Cover"}
          alt={store.name}
          style={{ height: "140px", objectFit: "cover" }}
        />
        <div className="position-absolute bottom-0 start-0 p-3">
          <img
            src={store.logo || "https://via.placeholder.com/80/198754/ffffff?text=Logo"}
            alt={store.name}
            width={80}
            height={80}
            className="rounded-circle border border-4 border-white shadow"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <Card.Body className="d-flex flex-column pt-5 pb-3">
        <Card.Title className="fw-bold text-dark mb-1">{store.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {store.description || "Official partner store"}
        </Card.Text>

        <Stack direction="horizontal" gap={2} className="mt-2 align-items-center">
          <Badge bg="success" className="fw-semibold">0 Products</Badge>
          <span className="text-warning ms-auto">
            {[...Array(5)].map((_, i) => (
              <StarFill
                key={i}
                size={14}
                className={i < Math.floor(store.rating || 4.5) ? "text-warning" : "text-muted"}
              />
            ))}
            <small className="text-dark ms-1 fw-semibold">{store.rating || "4.8"}</small>
          </span>
        </Stack>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Helmet><title>Stores | EMALL Cambodia</title></Helmet>

      {/* Hero */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg, #28a745, #20c997)" }}
      >
        <Container>
          <h1 className="display-4 fw-bold">Discover Amazing Stores</h1>
          <p className="lead">Shop from thousands of trusted sellers across Cambodia</p>
          <Form className="mt-4" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }}>
            <InputGroup className="w-100 mx-auto" style={{ maxWidth: "600px" }}>
              <Form.Control
                type="text"
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-start-pill py-3 border-0 shadow-sm"
              />
              <Button type="submit" variant="light" className="rounded-end-pill px-4">
                Search
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </div>

      <Container className="my-5">
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <div className="bg-white p-4 rounded-4 shadow-sm sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-bold text-success mb-4">Filter by Category</h5>
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="All Stores"
                  checked={!selectedCategory}
                  onChange={() => { setSelectedCategory(""); setCurrentPage(1); }}
                />
                {categories.map((cat) => (
                  <Form.Check
                    key={cat}
                    type="radio"
                    label={cat}
                    checked={selectedCategory === cat.toLowerCase().replace(/ & /g, "-")}
                    onChange={() => {
                      setSelectedCategory(cat.toLowerCase().replace(/ & /g, "-"));
                      setCurrentPage(1);
                    }}
                  />
                ))}
              </Form.Group>
              <hr className="my-4" />
              <div className="text-muted small">
                <strong>{totalStores.toLocaleString()}</strong> stores found
              </div>
            </div>
          </Col>

          {/* Store Grid */}
          <Col lg={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" size="lg" />
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-success mb-0">
                    {searchQuery ? `Results for "${searchQuery}"` : selectedCategory
                      ? categories.find(c => c.toLowerCase().replace(/ & /g, "-") === selectedCategory) || "Stores"
                      : "All Stores"}
                  </h3>
                  <Badge bg="success" pill className="fs-5 px-4 py-2">
                    {totalStores} Stores
                  </Badge>
                </div>

                <Row xs={1} sm={2} md={3} lg={4} className="g-4 g-md-5">
                  {stores.map((store) => (
                    <Col key={store.id}>
                      <StoreCard store={store} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Tiny CSS for hover effect (optional but beautiful) */}
      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
        .transition-all { transition: all 0.3s ease !important; }
      `}</style>
    </>
  );
}

export default Stores;