import React, { useState, useEffect } from "react";
import "./TicTacToe.css";
import axios from "axios";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);  // Default score as 0
  const [loading, setLoading] = useState(true);  // Loading state for checking user

  // Load user score from localStorage on mount
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser && parsedUser.email && typeof parsedUser.score === "number") {
          console.log("Initial Score from LocalStorage:", parsedUser.score);
          setScore(parsedUser.score);
        } else {
          console.error("Invalid user data in localStorage");
        }
      } else {
        console.log("No user found in LocalStorage");
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    } finally {
      setLoading(false);  // Regardless of error, stop loading
    }
  }, []);

  // Handle Tic-Tac-Toe moves
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

  // Check for winner
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

  // Update user score in DB and localStorage
  const updateScore = async (newScore) => {
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!user || !user.email) {
      console.error("User email not found.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/update-score", {
        email: user.email, 
        score: newScore
      });

      console.log("API Response:", response);
      
      if (response?.data?.newScore !== undefined) {
        console.log("New Score Received:", response.data.newScore);
        setScore(response.data.newScore);

        const updatedUser = { ...user, score: response.data.newScore };
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        console.log("Updated LocalStorage:", JSON.parse(localStorage.getItem("user")));
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const status = winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? "X" : "O"}`;

  if (loading) {
    return <div>Loading...</div>;  // Display loading text while checking user
  }

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
