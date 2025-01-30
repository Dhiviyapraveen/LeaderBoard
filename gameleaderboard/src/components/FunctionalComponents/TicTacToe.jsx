import React, { useState, useEffect } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setScore(user.score);
    }
  }, []);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X" || gameWinner === "O") {
        updateScore(10); 
      }
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const updateScore = async (points) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) return;
  
    try {
      const response = await fetch("https://leaderboard-42zt.onrender.com/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, points }), // Ensure backend expects `points`
      });
  
      if (!response.ok) {
        throw new Error("Failed to update score");
      }
  
      const data = await response.json();
      if (typeof data.newScore === "number") { // Ensure it's a valid score
        user.score = data.newScore;
        localStorage.setItem("user", JSON.stringify(user));
        if (typeof setScore === "function") setScore(data.newScore); // Check if setScore is defined
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };
  

  const status = winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="tic-tac-toe-container">
      <img src="/tic.webp" alt="Tic Tac Toe Background" className="background-image1" />
      <h2>Tic Tac Toe</h2>
      <div className="status">{status}</div>
      <div className="score">Your Score: {score}</div>
      <div className="board">
        {board.map((value, index) => (
          <button key={index} onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
