// src/pages/admin/UsersManagement.js
import React, { useState, useEffect } from "react";
import {
  Container, Card, Table, Form, InputGroup, Button, Badge, Modal, Alert, Image
} from "react-bootstrap";
import { FaSearch, FaUserCheck, FaUserTimes, FaTrash, FaCrown } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

function UsersManagement() {
  const { user: currentUser } = useApp();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    const fakeUsers = [
      { id: 1, name: "Sokha", email: "sokha@gmail.com", role: "user", joined: "2025-11-01" },
      { id: 2, name: "Phorn Sunnich", email: "admin@gmall.com", role: "admin", joined: "2025-01-01" },
      { id: 3, name: "Sunnich", email: "sunnich@gmall.com", role: "admin", joined: "2025-10-20" },
      { id: 4, name: "Vannak", email: "vannak@gmail.com", role: "user", joined: "2025-11-25" },
    ];
    setUsers(fakeUsers);
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAdmin = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u));
    setAlert({ show: true, message: "User role updated!", variant: "success" });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setAlert({ show: true, message: "User deleted!", variant: "danger" });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-success text-white py-4">
          <h2 className="mb-0 d-flex align-items-center gap-3">
            Users Management
          </h2>
          <p className="mb-0 mt-2">Total: {users.length} users</p>
        </Card.Header>

        <Card.Body className="p-4">
          {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}

          <InputGroup className="mb-4" size="lg">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>

          <Table hover bordered className="text-center align-middle">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id}>
                  <td>{i + 1}</td>
                  <td>
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=28a745&color=fff&bold=true&size=128`}
                      roundedCircle
                      width={50}
                      height={50}
                      style={{ objectFit: "cover", border: "3px solid #28a745" }}
                    />
                  </td>
                  <td className="fw-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === "admin" ? "success" : "secondary"} className="px-3 py-2">
                      {user.role === "admin" ? <>Admin</> : "User"}
                    </Badge>
                  </td>
                  <td>{user.joined}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        size="sm"
                        variant={user.role === "admin" ? "warning" : "success"}
                        onClick={() => toggleAdmin(user.id)}
                        disabled={user.email === currentUser?.email}
                      >
                        {user.role === "admin" ? "Remove" : "Make Admin"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                        disabled={user.email === currentUser?.email}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Permanently delete <strong>{userToDelete?.email}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UsersManagement;