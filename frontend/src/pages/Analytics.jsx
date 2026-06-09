import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMeetupAnalytics } from '../services/api';

const Analytics = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getMeetupAnalytics(id);
        if (res.success && res.analytics) {
          setStats(res.analytics);
        } else {
          setError('Failed to fetch analytics statistics');
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Error connecting to analytics endpoint.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Calculating event statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to={`/meetups/${id}`} className="btn btn-outline mt-3">Back to Meetup</Link>
      </div>
    );
  }

  const { totalRegistrations, totalCheckIns, attendancePercentage, mostActiveMembers } = stats;

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1 className="page-title">Event Performance Analytics</h1>
        <p className="page-subtitle">Real-time engagement, attendance metrics, and networking reports</p>
        <Link to={`/meetups/${id}`} className="btn btn-outline btn-sm">
          ← Back to Meetup Details
        </Link>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎟️</div>
          <div className="metric-details">
            <h3>Total Registrations</h3>
            <span className="metric-number">{totalRegistrations}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✓</div>
          <div className="metric-details">
            <h3>Total Check-ins</h3>
            <span className="metric-number">{totalCheckIns}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-details">
            <h3>Attendance Rate</h3>
            <span className="metric-number">{attendancePercentage}%</span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="leaderboard-section">
        <h2>Most Active Members</h2>
        <p className="section-description">Members with the highest check-in counts across all platform meetups</p>

        {mostActiveMembers.length === 0 ? (
          <div className="empty-leaderboard">
            <p>No active attendance check-ins recorded yet on this platform.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member Name</th>
                  <th>Profession</th>
                  <th>Company</th>
                  <th>Total Events Attended</th>
                </tr>
              </thead>
              <tbody>
                {mostActiveMembers.map((member, index) => (
                  <tr key={member._id}>
                    <td>
                      <span className={`rank-badge rank-${index + 1}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="member-profile-cell">
                        <div className="member-avatar">
                          {member.profilePicture ? (
                            <img src={member.profilePicture} alt={member.name} />
                          ) : (
                            <span>{member.name.substring(0, 1).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="member-name-text">{member.name}</span>
                      </div>
                    </td>
                    <td>{member.profession || 'N/A'}</td>
                    <td>{member.company || 'N/A'}</td>
                    <td>
                      <span className="attendance-badge">
                        {member.checkInCount} check-ins
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
