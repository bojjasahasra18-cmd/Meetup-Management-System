import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";

const History = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setMeetups(data.meetups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) return <h2>Loading history...</h2>;

  return (
    <div className="page-container">
      <h1>Meetup History</h1>

      {meetups.length === 0 ? (
        <p>No completed meetups found.</p>
      ) : (
        meetups.map((meetup) => (
          <div key={meetup._id} className="meetup-card">
            <h3>{meetup.title}</h3>
            <p>{meetup.description}</p>
            <p>{meetup.venue}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default History;