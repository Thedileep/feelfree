const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
require("dotenv").config();
const path = require('path');

const app = express();


// Middleware
app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.static('public'))


//connect database
connectDB()

// API Routes
app.use("/api", require("./userRoutes/authRoutes"));
app.use("/api",require('./userRoutes/dashboradRoutes'));
app.use('/api',require('./userRoutes/chatAIRoutes'));
app.use('/api',require('./userRoutes/journalRoutes'));
//app.use('/api',require('./routes/moodRoutes'))

//therepist api
app.use('/api',require('./docRoutes/authDocRoutes'))
app.use('/api',require('./docRoutes/profileRoutes'))
app.use('/api',require('./docRoutes/changePasswordRoute'))

//admin API
app.use('/api',require('./adminRoutes/authRoute'))
app.use('/api',require('./adminRoutes/adminRoutes'))

// Correct PORT usage
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("✅ Server listening on port", port, "!");
});