// src/pages/AboutUs.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaRocket, FaUsers, FaShieldAlt, FaShippingFast, FaHeadset } from "react-icons/fa";

export default function AboutUs() {
  const { t } = useTranslation();

  const team = [
    {
      name: "Phorn Sunnich",
      role: "Lead Developer",
      photo: "/members/nich.jpg",
      desc: t("team.sunnich"),
    },
    {
      name: "Phin Sanny",
      role: "Frontend Developer",
      photo: "/members/sanny.jpg",
      desc: t("team.sanny"),
    },
    {
      name: "Ry Visal",
      role: "Frontend Developer",
      photo: "/members/visal.jpg",
      desc: t("team.visal"),
    },
    {
      name: "Phirum Pheakdey ",
      role: "Backend Developer",
      photo: "/members/pheakdey.jpg",
      desc: t("team.pheakdey"),
    },
    {
      name: "Roeurng Sokuthearong",
      role: "Backend Developer",
      photo: "/members/thearong.jpg",
      desc: t("team.sokuthearong"),
    },
  ];

  const mentor = {
    name: "Mr. Keo Tongheng",
    role: "Senior Advisor & Mentor",
    photo: "/members/tongheng.jpg",
    desc: t("mentor.desc"),
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #28a745, #20c997)",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold mb-3">About EMALL Cambodia</h1>
          <p className="lead fs-4">{t("about.tagline")}</p>
        </Container>
      </div>

      <Container className="my-5 py-5">
        {/* Mission & Vision */}
        <Row className="g-5 mb-5 text-center">
          <Col lg={6}>
            <Card className="border-0 shadow-lg h-100 hover-lift">
              <Card.Body className="p-5">
                <FaRocket size={70} className="text-success mb-4" />
                <h3 className="fw-bold text-success">{t("about.mission")}</h3>
                <p className="lead mt-3">{t("about.missionDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-lg h-100 hover-lift">
              <Card.Body className="p-5">
                <FaShieldAlt size={70} className="text-success mb-4" />
                <h3 className="fw-bold text-success">{t("about.vision")}</h3>
                <p className="lead mt-3">{t("about.visionDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Our Values */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success mb-4">{t("About Values")}</h2>
          <Row className="g-4 justify-content-center">
            {[
              { icon: FaShippingFast, title: t("about.fastDelivery") },
              { icon: FaHeadset, title: t("about.support24") },
              { icon: FaShieldAlt, title: t("about.securePayment") },
              { icon: FaUsers, title: t("about.trustedSellers") },
            ].map((item, i) => (
              <Col md={3} sm={6} key={i}>
                <div className="p-4 rounded-4 bg-light shadow-sm hover-lift">
                  <item.icon size={50} className="text-success mb-3" />
                  <h5 className="fw-semibold">{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Team Members */}
        <h2 className="text-center fw-bold text-success mb-5 mt-5">Our Amazing Team</h2>
        <Row className="g-4 justify-content-center">
          {team.map((member, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className="border-0 shadow-sm text-center team-card h-100">
                <Card.Img
                  variant="top"
                  src={member.photo}
                  className="rounded-circle mx-auto mt-4"
                  style={{ width: "160px", height: "160px", objectFit: "cover", border: "5px solid #198754" }}
                />
                <Card.Body>
                  <h5 className="fw-bold">{member.name}</h5>
                  <p className="text-success fw-semibold">{member.role}</p>
                  <p className="text-muted small">{member.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mentor */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-lg text-center mentor-card">
              <Card.Body className="p-5">
                <img
                  src={mentor.photo}
                  alt={mentor.name}
                  className="rounded-circle mb-4"
                  style={{ width: "180px", height: "180px", objectFit: "cover", border: "6px solid #198754c24" }}
                />
                <h4 className="fw-bold text-warning">{mentor.name}</h4>
                <p className="text-success fw-bold fs-5">{mentor.role}</p>
                <p className="lead text-muted">{mentor.desc}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Hover Effects */}
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
          background: linear-gradient(135deg, #f8f9fa, #e9f7ef);
          border: 2px solid #198754 !important;
        }
      `}</style>
    </>
  );
}