const mongoose=require('mongoose')

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  mood: { type: String, required: true },
  moodValue: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mood", moodSchema);
