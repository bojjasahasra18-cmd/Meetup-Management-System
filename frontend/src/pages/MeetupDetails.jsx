import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { exportMeetupCSV } from "../services/api";
import { useAuth } from '../context/AuthContext';
import {
  getMeetupById,
  registerForMeetup,
  checkInAttendee,
  getMeetupAttendees,
} from '../services/api';

const MeetupDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [meetup, setMeetup] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [whyAttend, setWhyAttend] = useState('');
  const [learn, setLearn] = useState('');
  const [contribute, setContribute] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchMeetupData = async () => {
    try {
      setError('');
      const meetupRes = await getMeetupById(id);
      if (meetupRes.success && meetupRes.meetup) {
        setMeetup(meetupRes.meetup);
      }

      const attendeesRes = await getMeetupAttendees(id);
      if (attendeesRes.success && attendeesRes.attendees) {
        setAttendees(attendeesRes.attendees);
      }
    } catch (err) {
      console.error('Error loading details:', err);
      setError('Could not retrieve meetup details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetupData();
  }, [id]);

  useEffect(() => {
    if (user && attendees.length > 0) {
      const checkedIn = attendees.some(
        (att) => att.name === user.name && att.profession === user.profession
      );
      setIsCheckedIn(checkedIn);
    }
  }, [user, attendees]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setRegistering(true);

    try {
      const data = await registerForMeetup(id, { whyAttend, learn, contribute });
      if (data.success) {
        setIsRegistered(true);
        setSuccessMsg('Successfully registered for this meetup!');
        setShowRegForm(false);
        fetchMeetupData();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
    } finally {
      setRegistering(false);
    }
  };

  const handleCheckIn = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const data = await checkInAttendee(id);
      if (data.success) {
        setIsCheckedIn(true);
        setSuccessMsg('Successfully checked in!');
        fetchMeetupData();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Check-in failed';
      setError(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading event information...</p>
      </div>
    );
  }

  if (error && !meetup) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-outline mt-3">Back to Dashboard</Link>
      </div>
    );
  }

  const formattedDate = new Date(meetup.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deadlineDate = new Date(meetup.registrationDeadline).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isDeadlinePassed = new Date() > new Date(meetup.registrationDeadline);

  const handleExportCSV = async () => {
  try {
    const blob = await exportMeetupCSV(id);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `meetup-${id}.csv`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("CSV export failed");
  }
};

  return (
    <div className="details-container">
      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="details-layout">
        <div className="details-main">
          <div className="details-banner">
            {meetup.banner ? (
              <img src={meetup.banner} alt={meetup.title} />
            ) : (
              <div className="details-banner-placeholder">
                <h1>📅 {meetup.title}</h1>
              </div>
            )}
          </div>

          <div className="details-body">
            <h1 className="details-title">{meetup.title}</h1>
            <p className="details-description">{meetup.description}</p>

            <div className="live-attendees-section">
              <h3 className="section-title">Live Attendees ({attendees.length})</h3>
              {attendees.length === 0 ? (
                <p className="no-attendees">No check-ins yet. Be the first to check in!</p>
              ) : (
                <div className="attendees-grid">
                  {attendees.map((attendee, index) => (
                    <div className="attendee-card" key={index}>
                      <div className="attendee-avatar">
                        {attendee.profilePicture ? (
                          <img src={attendee.profilePicture} alt={attendee.name} />
                        ) : (
                          <span>{attendee.name.substring(0, 1).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="attendee-info">
                        <h4>{attendee.name}</h4>
                        <p className="attendee-profession">{attendee.profession || 'Attendee'}</p>
                        <p className="attendee-company">{attendee.company || 'Freelancer'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sidebar-card">
            <h3>Event Information</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <strong>Date</strong>
                  <p>{formattedDate}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <strong>Time</strong>
                  <p>{meetup.startTime} - {meetup.endTime}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Venue</strong>
                  <p>{meetup.venue}</p>
                  {meetup.googleMapsLink && (
                    <a
                      href={meetup.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="maps-link"
                    >
                      View on Google Maps ↗
                    </a>
                  )}
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👥</span>
                <div>
                  <strong>Capacity</strong>
                  <p>{meetup.capacity} Seats Available</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⚠️</span>
                <div>
                  <strong>Register By</strong>
                  <p className={isDeadlinePassed ? 'text-danger' : ''}>
                    {deadlineDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="sidebar-actions">
              {isAuthenticated ? (
                <>
                  {!isCheckedIn && (
                    <>
                      {!isRegistered && !isDeadlinePassed && !showRegForm && (
                        <button
                          onClick={() => setShowRegForm(true)}
                          className="btn btn-primary btn-block btn-lg"
                        >
                          Register for Event
                        </button>
                      )}

                      {isRegistered && (
                        <button
                          onClick={handleCheckIn}
                          className="btn btn-success btn-block btn-lg"
                        >
                          Check In Now
                        </button>
                      )}

                      {isDeadlinePassed && !isRegistered && (
                        <button className="btn btn-disabled btn-block btn-lg" disabled>
                          Registration Closed
                        </button>
                      )}
                    </>
                  )}

                  {isCheckedIn && (
                    <div className="checked-in-badge">
                      ✓ Checked In
                    </div>
                  )}

                  <Link
                    to={`/meetups/${id}/analytics`}
                    className="btn btn-outline btn-block btn-lg mt-3"
                  >
                    View Analytics
                  </Link>

<button
  onClick={handleExportCSV}
  className="btn btn-outline btn-block btn-lg mt-3"
>
  Download CSV
</button>

</>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to register or check in.</p>
                  <Link to="/login" className="btn btn-primary btn-block">
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {showRegForm && (
            <div className="sidebar-card mt-3">
              <h3>Complete Registration</h3>
              <form onSubmit={handleRegister} className="reg-form">
                <div className="form-group">
                  <label htmlFor="whyAttend">Why do you want to attend? *</label>
                  <textarea
                    id="whyAttend"
                    placeholder="Brief description..."
                    value={whyAttend}
                    onChange={(e) => setWhyAttend(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="learn">What do you want to learn? *</label>
                  <textarea
                    id="learn"
                    placeholder="Specific skills or topics..."
                    value={learn}
                    onChange={(e) => setLearn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contribute">How will you contribute? *</label>
                  <textarea
                    id="contribute"
                    placeholder="Networking, volunteering, speaking..."
                    value={contribute}
                    onChange={(e) => setContribute(e.target.value)}
                    required
                  />
                </div>
                <div className="reg-form-buttons">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={registering}
                  >
                    {registering ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegForm(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetupDetails;
