// src/components/Footer.js
import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext';

function Footer() {
  const { t } = useTranslation();
  const { darkMode } = useContext(AppContext);

  return (
    <footer
      className="mt-5 text-white"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #198754 0%, #146c43 100%)'
          : '#198754', 
        padding: '50px 0 30px',
        borderTop: '1px solid #146c43',
      }}
    >
      <Container fluid className="px-4 px-lg-5">
        <Row className="gy-5">
          {/* Brand & Description */}
          <Col lg={4}>
            <h4 className="fw-bold mb-3">
              <img src="/emall-logo.png" alt="Emall" height="40" className="me-2" />
              
            </h4>
            <p className="opacity-90">
              {t('Your trusted online shopping destination in Cambodia. Shop with confidence, delivered with care.') ||
                'Your trusted online shopping destination in Cambodia. Shop with confidence, delivered with care.'}
            </p>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">{t('Quick Links') || 'Quick Links'}</h6>
            <ul className="list-unstyled">
              {[
                { to: '/', label: t('Home') || 'Home' },
                { to: '/products', label: t('Products') || 'Products' },
                { to: '/stores', label: t('Stores') || 'Stores' },
                { to: '/real-estate', label: t('RealEstate') || 'Real Estate' },
                { to: '/about', label: t('About') || 'About Us' },
              ].map((link, i) => (
                <li key={i} className="mb-2">
                  <Link
                    to={link.to}
                    className="text-white text-decoration-none opacity-85 hover-opacity-100"
                    style={{ transition: 'color 0.3s' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Support */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-3">{t('Support') || 'Support'}</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none opacity-85">
                  {t('Contact Us') || 'Contact Us'}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-white text-decoration-none opacity-85">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-white text-decoration-none opacity-85">
                  {t('Shipping & Returns') || 'Shipping & Returns'}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-white text-decoration-none opacity-85">
                  {t('Privacy Policy') || 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3}>
            <h6 className="fw-bold mb-3">{t('Contact') || 'Contact'}</h6>
            <p className="mb-1 opacity-90">Phnom Penh, Cambodia</p>
            <p className="mb-1">
              <a href="mailto:support@emallcambodia.com" className="text-white text-decoration-none">
                support@emallcambodia.com
              </a>
            </p>
            <p className="mb-1">
              <a href="tel:+855961234567" className="text-white text-decoration-none">
                +855 96 123 4567
              </a>
            </p>
          </Col>
        </Row>

        <hr className="my-4 border-light opacity-25" />

        <div className="text-center">
          <p className="mb-0 small opacity-75">
            © 2025 Emall Cambodia. {t('allRightsReserved') || 'All rights reserved.'}
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;