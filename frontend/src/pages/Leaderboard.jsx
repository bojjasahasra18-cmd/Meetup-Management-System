import React from "react";

const Leaderboard = () => {
  const leaders = [
    { name: "Sahasra", points: 120 },
    { name: "Alexa", points: 95 },
    { name: "John", points: 70 },
  ];

  return (
    <div className="page-container">
      <h1>🏆 Community Leaderboard</h1>

      {leaders.map((user, index) => (
        <div key={index} className="meetup-card">
          <h3>
            #{index + 1} {user.name}
          </h3>

          <p>⭐ {user.points} Points</p>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;