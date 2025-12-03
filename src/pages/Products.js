import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

// In your Products page
import { useSearchParams } from 'react-router-dom';


function Products() {
  const [products, setProducts] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')   
      .then((response) => {
        let data = response.data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          data = data.data || data.products || data.items || [];
        }
        const productArray = Array.isArray(data) ? data : [];
        
        setProducts(productArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">No products found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Products</h2>
      <Row xs={1} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id || product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;