// src/pages/RealEstate.js
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
  Pagination,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard"; // We'll create this next
import { Helmet } from "react-helmet";

function RealEstate() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // house, condo, land, etc.

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let url = "/real-estate";
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (typeFilter) params.append("type", typeFilter);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await api.get(url);
        setProperties(res.data.properties || res.data || []);
      } catch (err) {
        console.error("Failed to load properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value.trim());
  };

  const propertyTypes = ["All", "House", "Condo", "Apartment", "Land", "Villa", "Commercial"];

  return (
    <>
      <Helmet>
        <title>Real Estate | EMALL Cambodia</title>
      </Helmet>

      {/* Hero Section */}
      <div
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #28a745, #20c997)",
          minHeight: "320px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">Find Your Dream Home</h1>
          <p className="lead mb-4">Buy, Rent or Sell Properties in Cambodia</p>

          <Form onSubmit={handleSearch} className="mt-4">
            <InputGroup className="w-100 mx-auto" style={{ maxWidth: "700px" }}>
              <Form.Control
                name="search"
                type="text"
                placeholder="Search by location, project name..."
                className="rounded-start-pill py-3 border-0 shadow-sm"
                defaultValue={searchQuery}
              />
              <Button
                type="submit"
                variant="light"
                className="rounded-end-pill px-5 shadow-sm"
              >
                Search
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </div>

      <Container className="my-5">
        <Row>
          {/* Filters Sidebar */}
          <Col lg={3} className="mb-4">
            <div className="bg-white p-4 rounded-4 shadow-sm sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-bold text-success mb-4">Property Type</h5>
              {propertyTypes.map((type) => (
                <Form.Check
                  key={type}
                  type="radio"
                  label={type === "All" ? "All Properties" : type}
                  name="type"
                  checked={typeFilter === (type === "All" ? "" : type.toLowerCase())}
                  onChange={() => setTypeFilter(type === "All" ? "" : type.toLowerCase())}
                  className="mb-2"
                />
              ))}
            </div>
          </Col>

          {/* Property Grid */}
          <Col lg={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" size="lg" />
                <p className="mt-3 text-muted">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-5">
                <img src="/illustrations/no-data.svg" alt="No properties" width="180" className="mb-4" />
                <h4>No properties found</h4>
                <p className="text-muted">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-success mb-0">
                    {searchQuery ? `Results for "${searchQuery}"` : "All Properties"}
                  </h3>
                  <Badge bg="success" className="fs-6">
                    {properties.length} {properties.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>

                <Row xs={1} md={2} lg={3} className="g-4">
                  {properties.map((property) => (
                    <Col key={property.id || property._id}>
                      <PropertyCard property={property} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RealEstate;