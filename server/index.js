const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const http = require("http");
const { initSocket } = require("./socket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

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
app.use('/api',require('./userRoutes/bookRoutes'))
app.use("/api/payments", require('./userRoutes/paymentRoute'));
app.use('/api',require('./userRoutes/chatscheduleRoutes'))


//app.use('/api',require('./routes/moodRoutes'))

//therepist api
app.use('/api',require('./docRoutes/authDocRoutes'))
app.use('/api',require('./docRoutes/profileRoutes'))
app.use('/api',require('./docRoutes/changePasswordRoute'))
app.use('/api',require('./docRoutes/doctorListRoute'))
app.use('/api',require('./docRoutes/bookingroutes'))

//admin API
app.use('/api',require('./adminRoutes/authRoute'))
app.use('/api',require('./adminRoutes/adminRoutes'))
app.use('/api',require('./adminRoutes/AuditLogRoutes'))


//shared Api
app.use("/api/agora",require("./sharedRoutes/agora"))

//socket.io 
app.set("io", io);

// Correct PORT usage
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("✅ Server listening on port", port, "!");
});