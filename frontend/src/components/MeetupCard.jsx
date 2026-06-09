import React from 'react';
import { Link } from 'react-router-dom';

const MeetupCard = ({ meetup }) => {
  const {
    _id,
    title,
    banner,
    description,
    date,
    startTime,
    venue,
    capacity,
  } = meetup;

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const shortDescription =
    description.length > 120 ? `${description.substring(0, 120)}...` : description;

  return (
    <div className="meetup-card">
      <div className="meetup-card-banner">
        {banner ? (
          <img src={banner} alt={title} />
        ) : (
          <div className="meetup-card-banner-placeholder">
            <span>📅 {title.substring(0, 1).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="meetup-card-content">
        <h3 className="meetup-card-title">{title}</h3>
        <p className="meetup-card-meta">
          <span className="meta-item">🗓️ {formattedDate}</span>
          <span className="meta-item">🕒 {startTime}</span>
        </p>
        <p className="meetup-card-venue">📍 {venue}</p>
        <p className="meetup-card-desc">{shortDescription}</p>
        <div className="meetup-card-footer">
          <span className="meetup-card-capacity">👥 Capacity: {capacity}</span>
          <Link to={`/meetups/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MeetupCard;
