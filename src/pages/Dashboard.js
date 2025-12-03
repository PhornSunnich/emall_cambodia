import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    navigate('/login');
    return null;
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Alert variant="success" className="text-center">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <Button variant="danger" onClick={logout}>Logout</Button>
    </Alert>
  );
}