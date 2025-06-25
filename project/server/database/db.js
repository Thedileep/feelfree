const mongoose = require("mongoose");

const connectDB = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDB;
