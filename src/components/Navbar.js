// src/components/Navbar.js
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  Form,
  Button,
  Dropdown,
  Image,
  Badge,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  FaShoppingCart,
  FaHeart,
  FaGlobe,
  FaSearch,
  FaUserCircle,
  FaBoxOpen,
  FaSignOutAlt,
} from 'react-icons/fa';

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, favorites, user, logout } = useApp(); // ← Using logout from context

  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const favoritesCount = favorites?.length || 0;
  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // ONLY THIS FUNCTION CHANGED
  const handleLogout = () => {
    logout(); // Clean logout via context
    navigate("/login");
  };

  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    const name = user?.name || user?.email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=28a745&color=fff&bold=true&size=128`;
  };

  // Your entire beautiful design remains EXACTLY the same below
  return (
    <BSNavbar
      expand="lg"
      sticky="top"
      className="shadow-sm"
      style={{
        background: '#ffffff',
        borderRadius: '70px',
        margin: '16px 24px',
        padding: '14px 28px',
        border: '1px solid #e0e0e0',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* === Everything below is 100% your original design === */}
      <Container fluid className="px-2">
        <BSNavbar.Brand as={Link} to="/">
          <img src="/emall-logo.png" alt="eMall Cambodia" height="46" />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />

        <BSNavbar.Collapse id="main-navbar">
          {/* Left Menu */}
          <Nav className="me-auto align-items-center fw-semibold gap-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/products', label: 'Products' },
              { path: '/stores', label: 'Stores' },
              { path: '/brands', label: 'Brands' },
              { path: '/real-estate', label: 'RealEstate' },
              { path: '/about', label: 'About' },
            ].map(({ path, label }) => (
              <Nav.Link
                key={path}
                as={Link}
                to={path}
                className={isActive(path) ? 'text-success fw-bold' : 'text-dark'}
              >
                {t(label)}
              </Nav.Link>
            ))}
          </Nav>

          {/* Search Bar */}
          <Form onSubmit={handleSearch} className="mx-lg-4 flex-grow-1" style={{ maxWidth: '460px' }}>
            <div
              className="d-flex align-items-center rounded-pill overflow-hidden border-0 shadow-sm"
              style={{
                background: '#f8f9fa',
                height: '54px',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(40,167,69,0.2)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'}
            >
              <Form.Control
                type="search"
                placeholder={t('Search products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent px-4 fs-5"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              <Button
                type="submit"
                variant="success"
                className="rounded-pill mx-2 d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px' }}
              >
                <FaSearch size={20} />
              </Button>
            </div>
          </Form>

          {/* Right Side Icons */}
          <Nav className="align-items-center gap-3">
            {/* Favorites, Cart, Language → unchanged */}
            <Nav.Link as={Link} to="/favorites" className="position-relative">
              <FaHeart size={24} className={isActive('/favorites') ? 'text-success' : 'text-dark'} />
              {favoritesCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle fs-6">
                  {favoritesCount}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FaShoppingCart size={26} className={isActive('/cart') ? 'text-success' : 'text-dark'} />
              {cartCount > 0 && (
                <Badge bg="primary" pill className="position-absolute top-0 start-100 translate-middle fs-6">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="text-dark p-0">
                <FaGlobe size={22} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => i18n.changeLanguage('en')}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage('km')}>ភាសាខ្មែរ</Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage('zh')}>中文</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Menu */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-2 text-decoration-none p-0"
                  id="user-dropdown"
                >
                  <Image
                    key={user.avatar || user.email}
                    src={getAvatarUrl()}
                    roundedCircle
                    width={44}
                    height={44}
                    alt={user.name || "User"}
                    style={{ objectFit: 'cover', border: '3px solid #28a745' }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=28a745&color=fff&bold=true`;
                    }}
                  />
                  <span className="fw-semibold d-none d-lg-block text-success">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0 py-3 rounded-3" style={{ minWidth: '230px' }}>
                  <Dropdown.Item as={Link} to="/profile" className="py-3">
                    <FaUserCircle className="me-3 text-success" size={20} /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-orders" className="py-3">
                    <FaBoxOpen className="me-3 text-success" size={20} /> My Orders
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="py-3 text-danger">
                    <FaSignOutAlt className="me-3" size={20} /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button as={Link} to="/register" variant="outline-success" className="rounded-pill px-4 py-2 fw-semibold">
                  {t('Register')}
                </Button>
                <Button as={Link} to="/login" variant="success" className="rounded-pill px-4 py-2 fw-semibold">
                  {t('Login')}
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;