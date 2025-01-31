import React, { useState, useEffect } from "react";
import axios from "axios";
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    setLoading(true);
    axios
      .get("https://leaderboard-42zt.onrender.com/signups") 
      .then((response) => {
        setLeaderboard(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      });
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      {loading ? <p>Loading...</p> : null}

      {leaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Email</th>
              
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.username}</td>
                <td>{entry.email}</td>
                <td>{entry.score || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
