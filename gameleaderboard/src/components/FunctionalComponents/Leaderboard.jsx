import React, { useState } from "react";
import axios from "axios";
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/leaderboard") 
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
      <button onClick={fetchLeaderboard} disabled={loading}>
        {loading ? "Loading..." : "Show Leaderboard"}
      </button>

      {leaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.username}</td>
                <td>{entry.wins || 0}</td>
                <td>{entry.score}</td>
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
