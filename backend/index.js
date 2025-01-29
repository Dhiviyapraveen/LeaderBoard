
const express = require('express');
const path = require('path'); 
const mdb = require('mongoose');
const dotenv = require('dotenv');
const Signup = require("./models/signupSchema");
const user=require("./models/userschema");
const bcrypt = require('bcrypt');
const cors=require('cors');
const app = express();

app.use(express.json())
app.use(cors())
dotenv.config()

mdb.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.log("MongoDb connection unsuccessful", err);
  });

app.get('/', (req, res) => {
  res.send("Welcome to Backend friends");
});

app.get('/static', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); 
});

app.post('/signup', async(req, res) => {
  var {  username, email, password } = req.body;
  var hashedPassword=await bcrypt.hash(password,15);
  console.log(hashedPassword)
  try {
    console.log("inside try");
    const newCustomer = new Signup({
  
      username: username,
      email: email,
      password: hashedPassword,
    });

    console.log(newCustomer);
    newCustomer.save();
    res.status(201).json({response:"Signup successful",signupStatus:true});
  } catch (err) {
    res.status(400).send("Signup unsuccessful", err);
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email: email });
    if (!user) {
      return res.status(404).send({response:"User not found",loginStatus:false});
    }

    if (bcrypt.compare(user.password , password)) {
      res.status(200).send({response:"Login successful",loginStatus:true});
    } else {
      res.status(401).send({response:"Incorrect password",loginStatus:false});
    }
  } catch (err) {
    res.status(500).send("Error during login");
  }
});




app.post("/update-score", async (req, res) => {
  const { email, points } = req.body;
  try {
    let user = await user.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.score += points;
    await user.save();
    res.json({ newScore: user.score });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});