// src/components/ProductCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useApp } from "../context/AppContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const isFav = isFavorite(product.id);

  const imageUrl = product.image
    ? product.image.trim().replace(/[\r\n]+/g, "")
    : "https://via.placeholder.com/600x400/f8f9fa/ccc?text=No+Image";

  return (
    <Card className="border-0 rounded-4 shadow-sm overflow-hidden h-100">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="d-block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-100"
          style={{
            height: "200px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400/f8f9fa/999?text=No+Image";
          }}
        />
      </Link>

      {/* Favorite Heart */}
      <Button
        variant="white"
        size="sm"
        className="position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm"
        style={{ zIndex: 10 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
      >
        {isFav ? <HeartFill size={18} className="text-danger" /> : <Heart size={18} />}
      </Button>

      <Card.Body className="p-4 text-center d-flex flex-column">
        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <h5 className="fw-bold mb-2">{product.name}</h5>
        </Link>

        {/* Category */}
        <p className="text-muted small mb-3">{product.category}</p>

        {/* Price */}
        <p className="fs-3 fw-bold text-success mb-4">
          ${parseFloat(product.price).toFixed(2)}
        </p>

        {/* Description (short) - optional */}
        {product.description && (
          <p className="text-muted small mb-4 flex-grow-1">
            {product.description.length > 60
              ? product.description.substring(0, 60) + "..."
              : product.description}
          </p>
        )}

        {/* Add to Cart Button - Dark Green */}
        <Button
          variant="success"
          className="w-100 rounded-pill py-3 fw-bold mt-auto"
          style={{
            
            border: "none",
            fontSize: "1.1rem",
          }}
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: parseFloat(product.price),
              image: imageUrl,
            })
          }
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}