import React, { useEffect, useState } from "react";
import API from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    company: "",
    lookingFor: "",
    linkedin: "",
portfolio: "",
bio: "",
  });

  const [message, setMessage] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");

      setFormData({
  name: res.data.user.name || "",
  email: res.data.user.email || "",
  profession: res.data.user.profession || "",
  company: res.data.user.company || "",
  lookingFor: res.data.user.lookingFor || "",
  linkedin: res.data.user.linkedin || "",
  portfolio: res.data.user.portfolio || "",
  bio: res.data.user.bio || "",
});
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await API.put("/auth/me", {
  profession: formData.profession,
  company: formData.company,
  lookingFor: formData.lookingFor,
  linkedin: formData.linkedin,
  portfolio: formData.portfolio,
  bio: formData.bio,
});

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">My Profile</h2>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Name</label>
            <input
              value={formData.name}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={formData.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Profession</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Looking For</label>
            <input
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
  <label>LinkedIn</label>
  <input
    name="linkedin"
    value={formData.linkedin}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Portfolio</label>
  <input
    name="portfolio"
    value={formData.portfolio}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Bio</label>
  <textarea
    name="bio"
    value={formData.bio}
    onChange={handleChange}
  />
</div>

          <button className="btn btn-primary btn-block">
            Save Changes
          </button>

        </form>

<div className="profile-card" style={{ marginTop: "20px" }}>
  <h3>Member Achievements</h3>

  <p>⭐ Points: 15</p>

  <h4>Badges</h4>

  <div>
    <span>🏅 Consistent Attendee</span>
  </div>

  <div>
    <span>🏅 Super Networker</span>
  </div>
</div>

<div className="profile-card" style={{ marginTop: "20px" }}>
  <h3>📇 Smart Networking Card</h3>

  <p><strong>Name:</strong> {formData.name}</p>
  <p><strong>Profession:</strong> {formData.profession}</p>
  <p><strong>Company:</strong> {formData.company}</p>
  <p><strong>LinkedIn:</strong> {formData.linkedin}</p>

<button
  className="btn btn-primary"
  onClick={() => setShowCard(true)}
>
  Share Card
</button>

{showCard && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#16213e",
        padding: "25px",
        borderRadius: "15px",
        textAlign: "center",
        border: "1px solid white",
      }}
    >
    <h3>📇 My Networking Card</h3>

    <p><strong>Name:</strong> {formData.name}</p>
    <p><strong>Profession:</strong> {formData.profession}</p>
    <p><strong>Company:</strong> {formData.company}</p>
    <p><strong>LinkedIn:</strong> {formData.linkedin}</p>

    <QRCodeCanvas
      value={`Name:${formData.name}
Profession:${formData.profession}
Company:${formData.company}
LinkedIn:${formData.linkedin}`}
      size={180}
    />

    <br />
    <br />

    <button
      className="btn btn-secondary"
      onClick={() => setShowCard(false)}
    >
      Close Card
    </button>
    </div>
  </div>
)}
</div>

      </div>
    </div>
  );
};

export default Profile;