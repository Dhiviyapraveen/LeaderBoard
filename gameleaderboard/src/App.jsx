import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/FunctionalComponents/Home";
import TicTacToe from "./components/FunctionalComponents/TicTacToe";
import RockPaperScissors from "./components/FunctionalComponents/RockPaperScissors";
import Leaderboard from "./components/FunctionalComponents/Leaderboard";
import SignUp from "./components/FunctionalComponents/Signup";
import Login from "./components/FunctionalComponents/Login";
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
  );
};

export default App;

