// src/components/PropertyCard.jsx
import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  const images = property.images || [];
  const price = property.price ? `$${property.price.toLocaleString()}` : "Contact for price";

  return (
    <Link
      to={`/real-estate/${property.id || property._id}`}
      className="text-decoration-none"
    >
      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow-lg transition-all">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={images[0] || "https://via.placeholder.com/400x300.png?text=Property"}
            alt={property.title}
            style={{ height: "220px", objectFit: "cover" }}
          />
          <Badge bg="success" className="position-absolute top-0 end-0 m-3 px-3 py-2">
            {property.type || "Property"}
          </Badge>
          {property.for_rent && (
            <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-3 px-3 py-2">
              For Rent
            </Badge>
          )}
        </div>

        <Card.Body className="p-3">
          <Card.Title className="fw-bold text-dark fs-6 line-clamp-2">
            {property.title || "Beautiful Property"}
          </Card.Title>

          <div className="text-success fw-bold fs-5 mb-2">{price}</div>

          <div className="text-muted small mb-3">
            {property.location || "Phnom Penh, Cambodia"}
          </div>

          <div className="d-flex gap-3 text-muted small">
            {property.bedrooms && (
              <span>{property.bedrooms} Bed</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} Bath</span>
            )}
            {property.area && (
              <span>{property.area} m²</span>
            )}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}