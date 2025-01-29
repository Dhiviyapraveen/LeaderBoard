import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className="home-header">
        <div className="game-name">GameVerse</div>
        <div className="auth-buttons">
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </header>
      <div className="home-container">
       
        <img
          src="/gamebackground.avif" 
          alt="Background"
          className="background-image"
        />
        <div className="content">
          <h1>Welcome to GameVerse</h1>
          <div className="game-buttons">
            <button onClick={() => navigate("/tic-tac-toe")}>Tic Tac Toe</button>
            <button onClick={() => navigate("/rock-paper-scissors")}>
              Rock Paper Scissors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
