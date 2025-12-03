// src/components/FeaturedProducts.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api';  // ← This uses your real backend
import { Link } from 'react-router-dom';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/api/products?limit=8')  // Gets latest 8 products from your real DB
      .then(res => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load featured products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-success">
          {t('featuredProducts') || 'Featured Products'}
        </h2>

        <Row>
          {products.map(product => (
            <Col md={6} lg={3} key={product.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <Card.Img
                  variant="top"
                  src={product.image || "https://via.placeholder.com/300x300.png?text=No+Image"}
                  alt={product.name}
                  style={{ height: '220px', objectFit: 'cover' }}
                  className="p-3"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate fw-bold">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">
                    {product.description?.substring(0, 60)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <h4 className="text-success fw-bold">${product.price}</h4>
                    <div className="d-grid gap-2">
                      <Button variant="success" size="sm">
                        {t('addToCart') || 'Add to Cart'}
                      </Button>
                      <Button as={Link} to={`/product/${product.id}`} variant="outline-secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

export default FeaturedProducts;