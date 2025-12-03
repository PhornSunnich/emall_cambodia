import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useApp } from "../context/AppContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useApp();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Product not found");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  if (!product)
    return (
      <Container>
        <p>Product not found</p>
      </Container>
    );

  return (
    <Container className="my-5">
      <Button
        as={Link}
        to="/products"
        variant="outline-secondary"
        className="mb-4"
      >
        ← Back to Products
      </Button>

      <Card>
        <Row className="g-0">
          <Col md={6}>
            <Card.Img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.name}
              style={{ height: "100%", objectFit: "cover" }}
            />
          </Col>
          <Col md={6}>
            <Card.Body className="p-5">
              <Card.Title as="h1">{product.name}</Card.Title>
              <Card.Text className="text-muted mb-4">
                {product.category}
              </Card.Text>

              <Card.Text className="fs-3 fw-bold text-success mb-4">
                ${product.price}
              </Card.Text>

              <Card.Text>{product.description}</Card.Text>

              <Button
                variant="success"
                size="lg"
                className="mt-3 w-100"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price), 
                    image: product.image || null,
                  })
                }
              >
                Add to Cart
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProductDetail;
