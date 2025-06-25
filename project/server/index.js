const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//connect database
connectDB()

// API Routes
app.use("/api", require("./routes/authRoutes"));

// Correct PORT usage
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("✅ Server listening on port", port, "!");
});