// src/pages/Home.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flash Sale Countdown
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(Date.now() + 24 * 60 * 60 * 1000) - new Date();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(timer);
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smart data fetching — never empty!
  useEffect(() => {
    const fetchData = async () => {
      try {
        let featuredData = [];
        let bestData = [];

        // 1. Try to get real featured products
        try {
          const res = await api.get("/products?featured=1&limit=8");
          featuredData = res.data.products || res.data || [];
        } catch (e) {
          console.log("No featured products → using fallback");
        }

        // 2. If no featured → get latest/random
        if (featuredData.length === 0) {
          const fallback = await api.get("/products?limit=8");
          featuredData = fallback.data.products || fallback.data || [];
        }

        // 3. Try best sellers
        try {
          const res = await api.get("/products?best_seller=1&limit=12");
          bestData = res.data.products || res.data || [];
        } catch (e) {
          console.log("No best_seller → using fallback");
        }

        // 4. Fallback: get most viewed or random
        if (bestData.length === 0) {
          const fallback = await api.get("/products?limit=20&sort=views_desc");
          bestData = (fallback.data.products || fallback.data || []).slice(
            0,
            12
          );
        }

        setFeatured(featuredData);
        setBestSellers(bestData);
      } catch (err) {
        console.error("Error loading home:", err);
        // Final emergency fallback — show something!
        const any = await api.get("/products?limit=20");
        const products = any.data.products || any.data || [];
        setFeatured(products.slice(0, 8));
        setBestSellers(products.slice(0, 12));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    {
      name: "Mobile & Internet",
      slug: "Mobile & Internet",
      icon: "smartphone",
    },
    { name: "Local Food", slug: "Local Food", icon: "rice-bowl" },
    { name: "Electronics", slug: "Electronics", icon: "tv" },
    { name: "Beauty & Health", slug: "Beauty & Health", icon: "spa" },
    { name: "Home & Living", slug: "Home & Living", icon: "sofa" },
    { name: "Books & Stationery", slug: "Books & Stationery", icon: "book" },
    {
      name: "Beauty & Personal Care",
      slug: "Beauty & Personal Care",
      icon: "cosmetic-brush",
    },
    { name: "Grocery & Drinks", slug: "Grocery & Drinks", icon: "grocery-bag" },
    { name: "Automotive", slug: "Automotive", icon: "car" },
    { name: "Toys & Baby", slug: "Toys & Baby", icon: "teddy-bear" },
  ];

  const iconUrl = (name) => `https://img.icons8.com/fluency/96/${name}.png`;

  return (
    <>
      <Carousel className="mb-5 shadow-lg rounded-4 overflow-hidden">
        <Carousel.Item>
          <img
            src="/banners/banner1.jpg"
            className="d-block w-100"
            alt="Flash Sale"
            style={{ height: "520px", objectFit: "cover" }}
          />
          <Carousel.Caption
            className="text-start p-5"
            style={{ background: "rgba(25,135,84,0.94)" }}
          >
            <h1 className="display-4 fw-bold text-white">
              Flash Sale 70% OFF!
            </h1>
            <p className="fs-3 text-white mb-4">Limited time only!</p>
            <div className="d-flex align-items-center gap-4">
              <Badge bg="warning" text="dark" className="fs-4 px-5 py-3">
                {timeLeft}
              </Badge>
              <Button
                as={Link}
                to="/products?sale=1"
                variant="light"
                size="lg"
                className="rounded-pill px-5 fw-bold"
              >
                Shop Now
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/banners/banner2.jpg"
            className="d-block w-100"
            alt="Flash Sale"
            style={{ height: "520px", objectFit: "cover" }}
          />
          <Carousel.Caption
            className="text-start p-5"
            style={{ background: "rgba(25,135,84,0.94)" }}
          >
            <h1 className="display-4 fw-bold text-white">
              Flash Sale 70% OFF!
            </h1>
            <p className="fs-3 text-white mb-4">Limited time only!</p>
            <div className="d-flex align-items-center gap-4">
              <Badge bg="warning" text="dark" className="fs-4 px-5 py-3">
                {timeLeft}
              </Badge>
              <Button
                as={Link}
                to="/products?sale=1"
                variant="light"
                size="lg"
                className="rounded-pill px-5 fw-bold"
              >
                Shop Now
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/banners/banner3.jpg"
            className="d-block w-100"
            alt="Flash Sale"
            style={{ height: "520px", objectFit: "cover" }}
          />
          <Carousel.Caption
            className="text-start p-5"
            style={{ background: "rgba(25,135,84,0.94)" }}
          >
            <h1 className="display-4 fw-bold text-white">
              Flash Sale 70% OFF!
            </h1>
            <p className="fs-3 text-white mb-4">Limited time only!</p>
            <div className="d-flex align-items-center gap-4">
              <Badge bg="warning" text="dark" className="fs-4 px-5 py-3">
                {timeLeft}
              </Badge>
              <Button
                as={Link}
                to="/products?sale=1"
                variant="light"
                size="lg"
                className="rounded-pill px-5 fw-bold"
              >
                Shop Now
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Container className="my-5 py-4">
        {/* Categories */}
        <section className="text-center">
          <h2 className="display-5 fw-bold text-success mb-5">
            Shop by Category
          </h2>
          <Row className="g-4 g-lg-5 justify-content-center">
            {categories.map((cat, i) => (
              <Col xs={6} sm={4} md={3} lg key={i} className="text-center">
                <Link
                  to={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="text-decoration-none d-block"
                >
                  <div
                    className="p-4 bg-white rounded-circle shadow-sm hover-shadow-sm mx-auto"
                    style={{
                      width: "140px",
                      height: "140px",
                      transition: "all 0.3s",
                      border: "4px solid transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#198754")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  >
                    <img
                      src={iconUrl(cat.icon)}
                      alt={cat.name}
                      width={78}
                      height={78}
                      className="mb-2"
                      onError={(e) =>
                        (e.target.src = `https://via.placeholder.com/78/198754/white?text=${cat.name[0]}`)
                      }
                    />
                  </div>
                  <p className="mt-3 fw-semibold text-dark small mb-0">
                    {cat.name}
                  </p>
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Products — ALWAYS SHOWS SOMETHING */}
        <section className="my-5 py-5">
          <h2 className="text-center mb-5 fw-bold text-success display-6">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Loading hot deals...</p>
            </div>
          ) : (
            <>
              <Row xs={2} md={3} lg={4} className="g-4">
                {featured.map((product) => (
                  <Col key={product.id || product.product_id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-5">
                <Button
                  as={Link}
                  to="/products"
                  variant="outline-success"
                  size="lg"
                  className="rounded-pill px-6 py-3"
                >
                  View All Products
                </Button>
              </div>
            </>
          )}
        </section>

        {/* Best Sellers — ALWAYS SHOWS SOMETHING */}
        <section className="my-5 py-5 bg-light rounded-4">
          <Container>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold text-success mb-2">
                Best Sellers
              </h2>
              <p className="text-muted lead">Most popular this week</p>
            </div>

            <Row className="g-4 justify-content-center">
              {bestSellers.slice(0, 4).map((product, index) => (
                <Col key={product.id} xs={6} md={3}>
                  <div className="position-relative h-100">
                    {/* Ranking Badge #1 to #4 */}
                    <div
                      className="position-absolute top-0 start-50 translate-middle-x z-10 badge rounded-pill shadow-lg fw-bold text-white"
                      style={{
                        fontSize: "1.4rem",
                        padding: "0.8em 1.1em",
                        background:
                          index === 0
                            ? "#FFD700" // Gold
                            : index === 1
                            ? "#C0C0C0" // Silver
                            : index === 2
                            ? "#CD7F32" // Bronze
                            : "#28a745", // Green for #4
                        border: "5px solid white",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                      }}
                    >
                      #{index + 1}
                    </div>

                    {/* Product Card */}
                    <div className="h-100">
                      <ProductCard product={product} />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </Container>
    </>
  );
}

export default Home;
