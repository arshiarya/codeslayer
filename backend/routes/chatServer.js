// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai"; // or "@google/generative-ai" if updated

// dotenv.config();

// const router = express.Router();

// // Initialize Google GenAI client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // 🩺 Health check endpoint
// router.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     hasApiKey: !!process.env.GEMINI_API_KEY,
//     model: "gemini-2.5-flash"
//   });
// });

// // 💬 Chat endpoint
// router.post("/", async (req, res) => {
//   const { message, sessionId } = req.body;

//   if (!message || !process.env.GEMINI_API_KEY) {
//     return res.status(400).json({ error: "Missing message or API key." });
//   }

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: message
//     });

//     const reply =
//       response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "Sorry, I couldn't get a response.";

//     res.json({ reply });
//   } catch (error) {
//     console.error("Error calling GenAI:", error);
//     res.status(500).json({
//       reply: "There was an error processing your request. Please try again."
//     });
//   }
// });

// // 🔄 Optional reset endpoint
// router.post("/reset", (req, res) => {
//   const { sessionId } = req.body;
//   console.log(`Chat session ${sessionId} reset`);
//   res.json({ status: "ok" });
// });

// export default router;

import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const router = express.Router();

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Store conversation history per session (in-memory)
const sessionHistories = new Map();

// Balanced system prompt - natural but still structured when needed
const SYSTEM_PROMPT = `You are BetterX, a compassionate mental health support companion. 

YOUR STYLE:
- Be warm and conversational, like a caring friend
- Keep responses concise (3-6 sentences typically)
- Use simple, everyday language - avoid clinical jargon
- When giving tips or exercises, you CAN use bullet points for clarity
- Don't overuse formatting - keep it clean and readable
- Add emojis occasionally for warmth (💙 🌟) but sparingly

RESPONSE APPROACH:
1. Acknowledge their feelings first
2. Offer practical, actionable help
3. End with encouragement or a gentle question

EXAMPLES:

User: "I'm feeling really anxious about work"
You: "That work anxiety sounds really tough right now 💙 Here's something that might help in this moment:
• Take 3 slow, deep breaths - in for 4 counts, out for 6
• Name 3 things you can see around you to ground yourself
• Remind yourself this feeling will pass

You're being brave by reaching out. What's the main thing stressing you about work?"

User: "I need motivation"  
You: "I hear you. Sometimes finding that spark is hard. Remember that you've made it through every challenging day so far - that's real strength. Try starting with just one small thing today, something manageable. Small wins build momentum. What's one thing you could tackle today that would feel like progress?"

User: "Help me with breathing exercises"
You: "Let's do this together. Get comfortable and breathe in slowly through your nose for 4 counts, then out through your mouth for 6 counts. Repeat this 4-5 times. Feel your shoulders drop and your body relax with each exhale. How are you feeling now?"

REMEMBER:
- Stay warm and human, not robotic
- Be helpful and practical
- Use bullet points only when listing specific steps or tips
- Keep it conversational overall`;

// 🩺 Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash",
    activeSessions: sessionHistories.size
  });
});

// 💬 Chat endpoint
router.post("/", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      reply: "There's a configuration issue with the API key. Please check your .env file." 
    });
  }

  try {
    // Get or create conversation history for this session
    if (!sessionHistories.has(sessionId)) {
      sessionHistories.set(sessionId, [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: "model",
          parts: [{ text: "I'm here to support you. What's on your mind today?" }]
        }
      ]);
    }

    const history = sessionHistories.get(sessionId);

    // Add user message to history
    history.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Generate response with balanced parameters
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      generationConfig: {
        maxOutputTokens: 350,
        temperature: 0.8,
        topP: 0.92,
        topK: 40
      }
    });

    let reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here with you, but I'm having trouble responding right now. Could you try again?";

    // Light cleanup - remove bold formatting only
    reply = reply.replace(/\*\*([^*]+)\*\*/g, '$1');
    reply = reply.replace(/__([^_]+)__/g, '$1');
    reply = reply.trim();

    // Add bot response to history
    history.push({
      role: "model",
      parts: [{ text: reply }]
    });

    // Keep last 10 exchanges
    if (history.length > 22) {
      history.splice(2, history.length - 22);
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error calling GenAI:", error.message);
    
    let errorReply = "I'm having trouble connecting right now. ";
    
    if (error.message.includes("API key") || error.message.includes("API_KEY_INVALID")) {
      errorReply += "Please check your API key configuration.";
    } else if (error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
      errorReply += "I've reached my limit for now. Please try again in a few minutes.";
    } else {
      errorReply += "Please try again.";
    }
    
    res.status(500).json({ reply: errorReply });
  }
});

// 🔄 Reset endpoint
router.post("/reset", (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && sessionHistories.has(sessionId)) {
    sessionHistories.delete(sessionId);
    console.log(`✅ Chat session ${sessionId} reset`);
  }
  
  res.json({ status: "ok", message: "Session reset successfully" });
});

export default router;