// src/pages/Brands.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import api from "../services/api";
import { Helmet } from "react-helmet";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await api.get("/api/brands");
        setBrands(res.data.brands || []);
      } catch (err) {
        console.error("Failed to load brands:", err);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Official Brands & Partners | EMALL Cambodia</title>
      </Helmet>

      {/* Hero Section */}
      <div
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #28a745, #20c997)",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">Official Brands & Partners</h1>
          <p className="lead mb-4">Shop directly from trusted global & local brands</p>

          {/* Search Bar */}
          <Col lg={6} className="mx-auto">
            <Form.Control
              type="text"
              placeholder="Search brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shadow-lg border-0 rounded-pill py-3 px-5 text-center fs-5"
              style={{ maxWidth: "600px" }}
            />
          </Col>
        </Container>
      </div>

      <Container className="py-5">
        {/* Trusted Badge */}
        <div className="text-center mb-5">
          <Badge
            bg="success"
            className="px-5 py-3 fs-5 fw-bold rounded-pill shadow-lg"
            style={{ background: "#198754" }}
          >
            Trusted Brands in Cambodia
          </Badge>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted fs-5">Loading official brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="/illustrations/no-data.svg"
              alt="No brands"
              width="180"
              className="mb-4 opacity-75"
            />
            <h4 className="text-muted">
              {search ? `No results for "${search}"` : "No brands available yet"}
            </h4>
            {search && (
              <button
                className="btn btn-outline-success mt-3"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Brands Grid */}
            <Row
              xs={3}
              sm={4}
              md={5}
              lg={6}
              xl={8}
              className="g-4 g-md-5 justify-content-center"
            >
              {filteredBrands.map((brand) => (
                <Col key={brand.id}>
                  <Card
                    className="border-0 shadow-sm text-center bg-white brand-card h-100 overflow-hidden"
                    style={{ borderRadius: "24px", cursor: "pointer" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center bg-light bg-gradient"
                      style={{
                        height: "160px",
                        padding: "20px",
                        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      }}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="img-fluid brand-logo"
                        style={{
                          maxHeight: "110px",
                          maxWidth: "90%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/150/198754/white?text=${brand.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 3)}`;
                        }}
                      />
                    </div>
                    <Card.Body className="py-4">
                      <h6 className="fw-bold text-dark mb-0 fs-6">{brand.name}</h6>
                      {brand.store_count > 0 && (
                        <small className="text-success fw-semibold">
                          {brand.store_count} stores
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Total Count */}
            <div className="text-center mt-5">
              <Badge bg="light" text="dark" className="fs-6 px-4 py-2">
                {filteredBrands.length} Official Brand{filteredBrands.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </>
        )}
      </Container>

      {/* Beautiful Hover Effects */}
      <style jsx>{`
        .brand-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid #e9ecef !important;
        }
        .brand-card:hover {
          transform: translateY(-12px) scale(1.05);
          box-shadow: 0 25px 50px rgba(25, 135, 84, 0.2) !important;
          border-color: #198754 !important;
        }
        .brand-card:hover .brand-logo {
          transform: scale(1.15);
        }
        .brand-logo {
          transition: transform 0.4s ease;
        }
      `}</style>
    </>
  );
}