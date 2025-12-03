// src/pages/Favorites.js
import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext"; // Use the custom hook!
import { HeartFill } from "react-bootstrap-icons";

function Favorites() {
  const { t } = useTranslation();
  const { favorites } = useApp(); // This is the correct & clean way

  // Empty state
  if (!favorites || favorites.length === 0) {
    return (
      <Container className="my-5 py-5 text-center">
        <HeartFill size={90} className="text-muted mb-4 opacity-20" />
        <h2 className="text-muted mb-3 fw-light">
          {t("No favorites yet") || "No favorites yet"}
        </h2>
        <p className="text-muted mb-5 fs-5">
          {t("favorites_empty_message") || "Products you love will appear here"}
        </p>
        <Button
          as={Link}
          to="/products"
          variant="success"
          size="lg"
          className="rounded-pill px-5 py-3 fw-bold"
        >
          Explore Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="d-flex align-items-center mb-5">
        <HeartFill size={38} className="text-danger me-3" />
        <h1 className="mb-0 fw-bold">
          {t("My Favorites") || "My Favorites"} ({favorites.length})
        </h1>
      </div>

      {/* Products Grid */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {favorites.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Favorites;