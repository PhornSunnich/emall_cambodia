// src/pages/AboutUs.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaRocket, FaUsers, FaShieldAlt, FaShippingFast, FaHeadset, FaGlobe, FaHeart } from "react-icons/fa";

export default function AboutUs() {
  const { t } = useTranslation();

  const team = [
    { name: "Phorn Sunnich", role: "Lead Developer", photo: "/members/nich.jpg" },
    { name: "Phin Sanny", role: "Frontend Developer", photo: "/members/sanny.jpg" },
    { name: "Ry Visal", role: "Frontend Developer", photo: "/members/visal.jpg" },
    { name: "Phirum Pheakdey", role: "Backend Developer", photo: "/members/pheakdey.jpg" },
    { name: "Roeurng Sokuthearong", role: "Backend Developer", photo: "/members/thearong.jpg" },
  ];

  const mentor = {
    name: "Mr. Keo Tongheng",
    role: "Senior Advisor & Mentor",
    photo: "/members/tongheng.jpg",
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg, #28a745, #20c997)" }}
      >
        <Container>
          <h1 className="display-4 fw-bold mb-4">About EMALL Cambodia</h1>
          <p className="lead fs-3 col-lg-10 mx-auto opacity-95">
            Cambodia's fastest-growing online marketplace — built by Cambodians, for Cambodians.
          </p>
        </Container>
      </div>

      <Container className="my-5 py-5">
        {/* Mission & Vision */}
        <Row className="g-5 mb-5 text-center">
          <Col lg={6}>
            <Card className="border-0 shadow-lg h-100 hover-lift">
              <Card.Body className="p-5">
                <FaRocket size={70} className="text-success mb-4" />
                <h3 className="fw-bold text-success">Our Mission</h3>
                <p className="lead mt-4">
                  Empower local sellers and bring convenient, secure shopping to every corner of Cambodia.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-lg h-100 hover-lift">
              <Card.Body className="p-5">
                <FaGlobe size={70} className="text-success mb-4" />
                <h3 className="fw-bold text-success">Our Vision</h3>
                <p className="lead mt-4">
                  To be Cambodia’s #1 trusted e-commerce platform where quality meets community.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Values */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success mb-5">Why Choose EMALL?</h2>
          <Row className="g-4 justify-content-center">
            {[
              { icon: FaShippingFast, title: "Fast Nationwide Delivery" },
              { icon: FaHeadset, title: "24/7 Support" },
              { icon: FaShieldAlt, title: "Secure Payments" },
              { icon: FaHeart, title: "Support Local" },
              { icon: FaUsers, title: "Trusted Sellers" },
            ].map((item, i) => (
              <Col md={4} sm={6} key={i}>
                <div className="p-5 rounded-4 bg-light shadow-sm hover-lift text-center">
                  <item.icon size={60} className="text-success mb-3" />
                  <h5 className="fw-bold">{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Team Members - NO DESCRIPTION */}
        <h2 className="text-center fw-bold text-success mb-5">Our Team</h2>
        <Row className="g-4 justify-content-center">
          {team.map((member, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className="border-0 shadow-sm text-center team-card h-100">
                <Card.Img
                  variant="top"
                  src={member.photo}
                  className="rounded-circle mx-auto mt-4"
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    border: "5px solid #198754",
                  }}
                />
                <Card.Body className="pt-4">
                  <h5 className="fw-bold text-dark">{member.name}</h5>
                  <p className="text-success fw-semibold">{member.role}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mentor - NO DESCRIPTION */}
        <Row className="mt-5">
          <Col lg={6} className="mx-auto">
            <Card className="border-0 shadow-lg text-center mentor-card">
              <Card.Body className="p-5">
                <img
                  src={mentor.photo}
                  alt={mentor.name}
                  className="rounded-circle mb-4"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    border: "6px solid #19875440",
                  }}
                />
                <h4 className="fw-bold text-dark">{mentor.name}</h4>
                <p className="text-success fw-bold fs-5">{mentor.role}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Closing */}
        <div className="text-center my-5 py-5">
          <h3 className="fw-bold text-success">Proudly Built in Cambodia</h3>
          <p className="lead text-muted col-lg-8 mx-auto">
            Thank you for supporting local businesses and shopping with EMALL
          </p>
        </div>
      </Container>

      {/* Hover Effects - Exactly as you had */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-12px);
          transition: all 0.4s ease;
        }
        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(25,135,84,0.15) !important;
        }
        .mentor-card {
          background: linear-gradient(135deg, #f8fff9, #e8f5e9);
          border: 2px solid #198754 !important;
        }
      `}</style>
    </>
  );
}