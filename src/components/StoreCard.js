// src/components/StoreCard.js
import React from "react";
import { Card, Badge, Ratio } from "react-bootstrap";
import { Link } from "react-router-dom";

function StoreCard({ store }) {
  // Fallback images
  const logo = store.logo || "/images/store-logo-placeholder.png";
  const banner = store.banner || "/images/store-banner-placeholder.jpg";

  return (
    <Link
      to={`/store/${store.id || store._id}`}
      className="text-decoration-none"
      style={{ display: "block" }}
    >
      <Card
        className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative
                   transition-all duration-300 hover-shadow-lg hover-scale"
        style={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        {/* Banner Image with Ratio for consistent height */}
        <Ratio aspectRatio="21x9">
          <Card.Img
            variant="top"
            src={banner}
            alt={`${store.name} banner`}
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x150/28a745/ffffff?text=Store+Banner";
            }}
          />
        </Ratio>

        {/* Store Logo - Floating on top of banner */}
        <div
          className="position-absolute"
          style={{
            bottom: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "80px",
          }}
        >
          <div
            className="bg-white rounded-circle shadow-lg p-2 d-flex align-items-center justify-content-center
                       border border-4 border-white"
          >
            <img
              src={logo}
              alt={`${store.name} logo`}
              width={72}
              height={72}
              className="rounded-circle object-fit-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  store.name
                )}&background=28a745&color=fff&size=128&bold=true`;
              }}
            />
          </div>
        </div>

        {/* Card Body - with padding to avoid overlapping logo */}
        <Card.Body className="pt-5 text-center pb-4">
          <Card.Title className="fw-bold text-dark mb-2 fs-5">
            {store.name || "Unnamed Store"}
          </Card.Title>

          {store.description ? (
            <Card.Text className="text-muted small line-clamp-2">
              {store.description.length > 70
                ? `${store.description.substring(0, 70)}...`
                : store.description}
            </Card.Text>
          ) : (
            <Card.Text className="text-muted small fst-italic">
              No description available
            </Card.Text>
          )}

          <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
            <Badge bg="success" className="px-3 py-2">
              {store.total_products || store.product_count || 0} Products
            </Badge>

            {store.verified && (
              <Badge bg="primary" className="px-3 py-2">
                Verified
              </Badge>
            )}

            {store.official && (
              <Badge bg="warning" text="dark" className="px-3 py-2">
                Official
              </Badge>
            )}
          </div>

          {store.rating && (
            <div className="mt-3 text-warning">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(store.rating) ? "★" : "☆"}
                </span>
              ))}{" "}
              <small className="text-muted">({store.rating || 0})</small>
            </div>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
}

export default StoreCard;