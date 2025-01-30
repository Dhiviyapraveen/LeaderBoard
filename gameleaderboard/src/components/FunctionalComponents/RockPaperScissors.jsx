import React, { useState, useEffect } from "react";
import "./RockPaperScissors.css";

const RockPaperScissors = () => {
  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);

  const choices = ["Rock", "Paper", "Scissors"];

 
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("User from localStorage:", user); 
        if (user && user.score !== undefined) {
          setScore(user.score);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const determineWinner = (user, computer) => {
    if (user === computer) return "It's a Draw!";
    if (
      (user === "Rock" && computer === "Scissors") ||
      (user === "Paper" && computer === "Rock") ||
      (user === "Scissors" && computer === "Paper")
    ) {
      updateScore(5); 
      return "You Win!";
    }
    return "You Lose!";
  };

  const handleClick = (choice) => {
    const computerRandomChoice = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(computerRandomChoice);

    const gameResult = determineWinner(choice, computerRandomChoice);
    setResult(gameResult);
  };

 
  const updateScore = async (points) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const response = await fetch("https://leaderboard-42zt.onrender.com/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, points }),
      });

      const data = await response.json();
      if (data.newScore !== undefined) {
        user.score = data.newScore;
        localStorage.setItem("user", JSON.stringify(user));
        setScore(data.newScore);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <div className="rock-paper-scissors-container">
      <h2>Rock Paper Scissors</h2>
      <img
        src="/rock.webp"
        alt="Rock Paper Scissors"
        className="background-image2"
      />
      
      <div className="options-container">
        {choices.map((choice, index) => (
          <button key={index} className="option-button" onClick={() => handleClick(choice)}>
            {choice}
          </button>
        ))}
      </div>
      <div className="results-container">
        <p>Your Choice: {userChoice}</p>
        <p>Computer's Choice: {computerChoice}</p>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default RockPaperScissors;
