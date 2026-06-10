import React, { useEffect, useState } from "react";
import API from "../services/api";

const CommunityInsights = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(
        "/meetups/6a2718bdf9f00f5155898df5/analytics"
      );

      setAnalytics(res.data.analytics);
    } catch (err) {
      console.log(err);
    }
  };

  if (!analytics) {
    return <h2>Loading Analytics...</h2>;
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">

        <h2>📊 Community Insights</h2>

        <p>
          👥 Total Registrations:
          <strong> {analytics.totalRegistrations}</strong>
        </p>

        <p>
          ✅ Total Check-Ins:
          <strong> {analytics.totalCheckIns}</strong>
        </p>

        <p>
          📈 Attendance Rate:
          <strong> {analytics.attendancePercentage}%</strong>
        </p>

        <h3>🏆 Most Active Members</h3>

        {analytics.mostActiveMembers.map((member) => (
          <div
            key={member._id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #444",
              borderRadius: "8px",
            }}
          >
            <p><strong>{member.name}</strong></p>
            <p>{member.profession}</p>
            <p>{member.company}</p>
            <p>Check-ins: {member.checkInCount}</p>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
  🔥 Popular Interests
</h3>

{analytics.domainStats?.map((domain) => (
  <div
    key={domain._id}
    style={{
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #444",
      borderRadius: "8px",
    }}
  >
    <strong>{domain._id}</strong>

    <p>{domain.count} members interested</p>
  </div>
))}

      </div>
    </div>
  );
};

export default CommunityInsights;