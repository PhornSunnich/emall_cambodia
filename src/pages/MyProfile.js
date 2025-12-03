// src/pages/MyProfile.js
import React, { useState, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaUser, FaCamera, FaCheck } from "react-icons/fa";
import { useApp } from "../context/AppContext";

function MyProfile() {
  const { user, setUser } = useApp();

  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  const fileInputRef = useRef(null);

  // Trigger file picker when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Generate default avatar from name/email
  const getDefaultAvatar = () => {
    const displayName = name || user?.email?.split("@")[0] || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=28a745&color=fff&bold=true&size=256`;
  };

  // Handle file selection and upload to ImgBB
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const uploadedUrl = data.data.url;
        setAvatarUrl(uploadedUrl);
        setPreviewAvatar(uploadedUrl);

        setAlert({
          show: true,
          message: "Image uploaded successfully!",
          variant: "success",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setPreviewAvatar(getDefaultAvatar());
      setAlert({
        show: true,
        message: "Failed to upload image. Using default avatar.",
        variant: "danger",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setAlert({ show: false }), 4000);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setAlert({ show: true, message: "Name cannot be empty!", variant: "danger" });
      setTimeout(() => setAlert({ show: false }), 4000);
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      avatar: avatarUrl || null, // null = use default avatar
    };

    setUser(updatedUser);
    localStorage.setItem("emall_user", JSON.stringify(updatedUser));

    setAlert({ show: true, message: "Profile updated successfully!", variant: "success" });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  const currentAvatar = previewAvatar || getDefaultAvatar();

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-center">
        <Card className="shadow-lg border-0" style={{ maxWidth: "560px", borderRadius: "32px" }}>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* Header */}
          <Card.Header
            className="bg-success text-white text-center py-5 border-0"
            style={{ borderRadius: "32px 32px 0 0" }}
          >
            <div className="position-relative d-inline-block">
              <Image
                src={currentAvatar}
                roundedCircle
                width={140}
                height={140}
                alt="Profile"
                style={{
                  objectFit: "cover",
                  border: "6px solid white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
                onError={(e) => {
                  e.target.src = getDefaultAvatar();
                }}
              />

              {/* Camera Icon - now clickable */}
              <div
                className="position-absolute bottom-0 end-0 bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: "44px",
                  height: "44px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={handleCameraClick}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                {uploading ? (
                  <Spinner animation="border" size="sm" className="text-success" />
                ) : (
                  <FaCamera size={20} className="text-success" />
                )}
              </div>
            </div>

            <h2 className="mt-4 mb-0 fw-bold">My Profile</h2>
            <p className="mb-0 opacity-90 fs-5">{user?.email}</p>
          </Card.Header>

          {/* Body */}
          <Card.Body className="p-5">
            {alert.show && (
              <Alert variant={alert.variant} className="text-center fw-bold">
                {alert.message}
              </Alert>
            )}

            <Form>
              {/* Full Name */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  <FaUser className="me-2 text-success" /> Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="py-3 px-4 rounded-pill fs-5"
                  style={{ border: "2px solid #e0e0e0" }}
                />
              </Form.Group>

              {/* Email (disabled) */}
              <Form.Group className="mb-5">
                <Form.Label className="fw-bold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="py-3 px-4 rounded-pill bg-light"
                />
              </Form.Group>

              {/* Save Button */}
              <Button
                variant="success"
                size="lg"
                onClick={handleSave}
                disabled={uploading}
                className="w-100 rounded-pill py-3 fw-bold fs-4 shadow-lg d-flex align-items-center justify-content-center gap-3"
              >
                <FaCheck size={26} />
                {uploading ? "Uploading..." : "Save Changes"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default MyProfile;