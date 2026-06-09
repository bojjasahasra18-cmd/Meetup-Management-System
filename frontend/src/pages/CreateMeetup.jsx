import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeetup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateMeetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    banner: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    googleMapsLink: '',
    capacity: '',
    registrationDeadline: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { title, description, date, startTime, endTime, venue, capacity, registrationDeadline } = formData;
    if (!title || !description || !date || !startTime || !endTime || !venue || !capacity || !registrationDeadline) {
      setError('Please fill out all required fields marked with *');
      return;
    }

    if (parseInt(capacity) <= 0) {
      setError('Capacity must be at least 1 attendee');
      return;
    }

    setLoading(true);
    try {
      const data = await createMeetup({
        ...formData,
        capacity: Number(capacity),
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create meetup';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-error">
          <h3>Access Denied</h3>
          <p>Only organizers and admins can create meetups. Please contact system administrators if you need additional permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-meetup-container">
      <div className="form-card">
        <h2>Schedule a New Meetup</h2>
        <p className="subtitle">Enter meetup information below to open registration</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Meetup created successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="meetup-form">
          <div className="form-group">
            <label htmlFor="title">Meetup Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Node.js Hackathon or Design Sprint"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="banner">Banner Image URL</label>
            <input
              type="url"
              id="banner"
              name="banner"
              placeholder="https://images.unsplash.com/... (optional)"
              value={formData.banner}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Detailed explanation of the event objectives, speakers, and schedule..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity (Max Attendees) *</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                placeholder="50"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationDeadline">Registration Deadline *</label>
              <input
                type="datetime-local"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue Name / Address *</label>
              <input
                type="text"
                id="venue"
                name="venue"
                placeholder="e.g. Coworking Hub Room 402"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="googleMapsLink">Google Maps URL</label>
            <input
              type="url"
              id="googleMapsLink"
              name="googleMapsLink"
              placeholder="https://maps.google.com/?q=..."
              value={formData.googleMapsLink}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg mt-3"
            disabled={loading}
          >
            {loading ? 'Creating Meetup...' : 'Publish Meetup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetup;
