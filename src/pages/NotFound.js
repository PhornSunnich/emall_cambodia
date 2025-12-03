// src/pages/NotFound.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <Container className="text-center py-5 my-5">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2>{t('pageNotFound') || 'Page Not Found'}</h2>
      <p className="lead mb-4">
        {t('sorryPageNotExist') || 'Sorry, the page you are looking for does not exist.'}
      </p>
      <Button as={Link} to="/" variant="success" size="lg">
        {t('backToHome') || 'Back to Home'}
      </Button>
    </Container>
  );
}

export default NotFound;