const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Signup = require("./models/signupSchema"); // Signup collection

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connection Successful"))
  .catch((err) => console.error("MongoDB connection unsuccessful:", err));

app.get('/', (req, res) => {
  res.send("Welcome to Backend Friends");
});

app.get('/static', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); 
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new Signup({
      username,
      email,
      password: hashedPassword,
      score: 0 // Initialize score at 0
    });

    await newUser.save();
    res.status(201).json({ response: "Signup successful", signupStatus: true, user: newUser });
  } catch (err) {
    res.status(400).json({ response: "Signup unsuccessful", error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(404).json({ response: "User not found", loginStatus: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).json({ response: "Login successful", loginStatus: true, user });
    } else {
      res.status(401).json({ response: "Incorrect password", loginStatus: false });
    }
  } catch (err) {
    res.status(500).json({ response: "Error during login", error: err.message });
  }
});

// Update Score Route
app.post("/update-score", async (req, res) => {
  const { email, score } = req.body;

  if (!email || score === undefined) {
      return res.status(400).json({ error: "Invalid data" });
  }

  try {
      const updatedUser = await Signup.findOneAndUpdate(
          { email }, 
          { $set: { score } }, // Update score field
          { new: true } // Return updated document
      );

      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
      }

      console.log("Updated User:", updatedUser);
      res.json({ success: true, newScore: updatedUser.score }); // Send updated score
  } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
