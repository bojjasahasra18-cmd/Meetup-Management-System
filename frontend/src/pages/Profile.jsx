import React, { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    company: "",
    lookingFor: "",
  });

  const [message, setMessage] = useState("");

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

          <button className="btn btn-primary btn-block">
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;