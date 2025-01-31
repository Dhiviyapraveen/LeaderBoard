import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser && parsedUser.email && typeof parsedUser.score === "number") {
          setScore(parsedUser.score);
        } else {
          console.error("Invalid user data in localStorage");
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    } finally {
      setLoading(false);
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
      if (gameWinner === "X") {
        const newScore = score + 10;
        setScore(newScore);
        updateScore(newScore);
      }
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const updateScore = async (newScore) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.email) {
      console.error("User email not found.");
      return;
    }

    try {
      const response = await axios.post("https://leaderboard-42zt.onrender.com/update-score", {
        email: user.email,
        score: newScore
      });

      if (response?.data?.newScore !== undefined) {
        setScore(response.data.newScore);
        localStorage.setItem("user", JSON.stringify({ ...user, score: response.data.newScore }));
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleBack = () => {
    navigate("/"); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tic-tac-toe-container">
      <img src="/tic.webp" alt="Tic Tac Toe Background" className="background-image1" />
      <h2>Tic Tac Toe</h2>
      <div className="status">{winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? "X" : "O"}`}</div>
      <div className="score">Your Score: {score}</div>
      <div className="board">
        {board.map((value, index) => (
          <button key={index} onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
      <button className="back-button" onClick={handleBack}>Back</button>
    </div>
  );
};

export default TicTacToe;
