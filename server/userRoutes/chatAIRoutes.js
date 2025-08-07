const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  const payload = {
     model: 'openai/gpt-4o',
    messages: [
      {
        role: "user",
        content: userInput
      }
    ],
    max_tokens: 3000,
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", 
          "X-Title": "My Free AI Chat App"         
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI response failed." });
  }
});

module.exports = router;
