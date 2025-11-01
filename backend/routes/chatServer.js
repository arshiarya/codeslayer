import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai"; // or "@google/generative-ai" if updated

dotenv.config();

const router = express.Router();

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🩺 Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash"
  });
});

// 💬 Chat endpoint
router.post("/", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Missing message or API key." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't get a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Error calling GenAI:", error);
    res.status(500).json({
      reply: "There was an error processing your request. Please try again."
    });
  }
});

// 🔄 Optional reset endpoint
router.post("/reset", (req, res) => {
  const { sessionId } = req.body;
  console.log(`Chat session ${sessionId} reset`);
  res.json({ status: "ok" });
});

export default router;