import React, { useState, useEffect } from 'react';
import { getMeetups } from '../services/api';
import MeetupCard from '../components/MeetupCard';

const Dashboard = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMeetupsData = async () => {
      try {
        const data = await getMeetups();
        if (data.success && data.meetups) {
          setMeetups(data.meetups);
        } else {
          setError('Failed to fetch meetups');
        }
      } catch (err) {
        console.error('Error fetching meetups:', err);
        setError('Failed to fetch meetups from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetupsData();
  }, []);

  const filteredMeetups = meetups.filter((meetup) => {
    const titleMatch = meetup.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = meetup.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const venueMatch = meetup.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descMatch || venueMatch;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="page-title">Discover Meetups</h1>
          <p className="page-subtitle">Connect, share, and grow with experts at modern live sessions</p>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search meetups by title, topic, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading available meetups...</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          {filteredMeetups.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <h3>No Meetups Found</h3>
              <p>Try searching for another keyword or check back later.</p>
            </div>
          ) : (
            <div className="meetup-grid">
              {filteredMeetups.map((meetup) => (
                <MeetupCard key={meetup._id} meetup={meetup} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
