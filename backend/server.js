// // 1. Import necessary modules
// const express = require('express');
// const cors = require('cors');

// // 2. Create app instance
// const app = express();
// // We'll use port 5000 for the backend, as 3000 is common for frontend
// const PORT = 5000; 

// // 3. Apply essential Middleware
// app.use(cors()); // Allows frontend to communicate with this backend
// app.use(express.json()); // Allows the server to read JSON data from requests

// // 4. Define a Test Route (API Endpoint)
// app.get('/', (req, res) => {
//   res.status(200).send('Codeslayer backend is running successfully!');
// });

// // 5. Start the Server and listen for connections
// app.listen(PORT, () => {
//   console.log(`\n🚀 Server started on port ${PORT}`);
//   console.log(`Access the server at: http://localhost:${PORT}/`);
// });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { authRoutes } from "./routes/auth.js"; 
import announcementsRoutes from "./routes/announcements.js";
import storiesRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import usersRoutes from "./routes/users.js";
import chatBotRoutes from "./routes/chatServer.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import moodRoutes from "./routes/moodRoutes.js"; 
import userStatsRoutes from "./routes/userStatsRoutes.js";

import pool from "./config/db.js"; 
// ⚠️ NEW: Import the authentication middleware
import authenticateToken from './middleware/authenticateToken.js'; 

// CRITICAL FIX: Call dotenv.config() immediately after ALL imports
dotenv.config();

const app = express();
const PORT = 5050;

// ✅ Allow frontend to connect (adjust port if needed)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.json()); // Ensure Express's parser is active

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Ensure refresh_tokens table exists in Postgres so refresh-token storage works reliably.
async function ensureRefreshTokensTable() {
    try {
        const createSql = `
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                expires_at TIMESTAMP WITH TIME ZONE
            );
        `;
        await pool.query(createSql);
        console.log('✅ refresh_tokens table ensured');
    } catch (err) {
        console.warn('Could not ensure refresh_tokens table at startup:', err.message);
        // Don't crash the server — the auth route already falls back to in-memory store.
    }
}

// Call the ensure function at startup (non-blocking)
ensureRefreshTokensTable();

// ----------------------------------------------------
//          🛡️ COUNSELLING BOOKING ROUTES (PostgreSQL)
// ----------------------------------------------------

// 1. GET /api/counsellors/availability (Publicly accessible)
app.get('/api/counsellors/availability', async (req, res) => {
    try {
        const query = `
            SELECT
                cs.schedule_id,
                c.name,
                c.title,
                cs.schedule_date,
                cs.schedule_time
            FROM 
                counsellor_schedule cs
            JOIN 
                counsellors c ON cs.counsellor_id = c.counsellor_id
            WHERE 
                cs.is_booked = FALSE
                AND cs.schedule_date >= CURRENT_DATE
            ORDER BY 
                cs.schedule_date ASC, cs.schedule_time ASC;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching availability:", err);
        res.status(500).json({ error: "Failed to fetch schedule data." });
    }
});

// 2. 🔒 GET /api/bookings/my-appointments (Requires JWT)
app.get('/api/bookings/my-appointments', authenticateToken, async (req, res) => {
    // ID securely attached by the middleware
    const studentEnrollmentNumber = req.userId; 

    try {
        const query = `
            SELECT
                br.booking_id,
                br.status,
                c.name AS counsellor_name,
                c.title AS counsellor_title,
                cs.schedule_date,
                cs.schedule_time
            FROM 
                booking_records br
            JOIN 
                counsellor_schedule cs ON br.schedule_id = cs.schedule_id
            JOIN 
                counsellors c ON cs.counsellor_id = c.counsellor_id
            WHERE 
                br.student_id = $1
                AND cs.schedule_date >= CURRENT_DATE
            ORDER BY 
                cs.schedule_date ASC, cs.schedule_time ASC;
        `;
        const { rows } = await pool.query(query, [studentEnrollmentNumber]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching secure student bookings:", err);
        res.status(500).json({ error: "Failed to retrieve booking history." });
    }
});


// 3. 🔒 POST /api/bookings/create (Requires JWT + Transaction)
app.post('/api/bookings/create', authenticateToken, async (req, res) => {
    // CRITICAL FIX: Get the secure ID from the middleware, NOT req.body
    const studentEnrollmentNumber = req.userId;
    const { schedule_id, student_name } = req.body; 
    
    if (!schedule_id || !student_name) {
        return res.status(400).json({ success: false, message: "Missing schedule ID or student name." });
    }
    
    const client = await pool.connect(); 

    try {
        await client.query('BEGIN');

        const checkQuery = `
            SELECT is_booked
            FROM counsellor_schedule
            WHERE schedule_id = $1
            FOR UPDATE;
        `;
        const result = await client.query(checkQuery, [schedule_id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Schedule slot not found." });
        }
        if (result.rows[0].is_booked === true) {
            await client.query('ROLLBACK');
            return res.status(409).json({ success: false, message: "This slot was just booked by another student. Please choose another one." });
        }

        const updateQuery = `
            UPDATE counsellor_schedule
            SET is_booked = TRUE
            WHERE schedule_id = $1;
        `;
        await client.query(updateQuery, [schedule_id]);

        const insertQuery = `
            INSERT INTO booking_records (schedule_id, student_id, student_name, status)
            VALUES ($1, $2, $3, 'Confirmed')
            RETURNING booking_id;
        `;
        const bookingResult = await client.query(insertQuery, [schedule_id, studentEnrollmentNumber, student_name]);

        await client.query('COMMIT'); 

        res.json({ 
            success: true, 
            message: "Booking confirmed successfully.", 
            booking_id: bookingResult.rows[0].booking_id 
        });

    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error("Booking transaction failed:", err);
        res.status(500).json({ success: false, message: "An internal server error occurred during booking." });
    } finally {
        client.release(); 
    }
});


// ----------------------------------------------------
//                ⚡ EXISTING ROUTES
// ----------------------------------------------------

// 🔐 Authentication Routes
app.use("/api/auth", authRoutes);

// 📣 Feature Routes
app.use("/api/announcements", announcementsRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", usersRoutes);

// 🤖 Gemini ChatBot Routes
app.use("/api/gemini-chat", chatBotRoutes);

// 📊 Assessment Routes
app.use("/api/assessment", assessmentRoutes(pool));

// 🎭 MOOD TRACKER ROUTES (NEW)
app.use("/api/mood", moodRoutes(pool)); 
app.use("/api/user-stats", userStatsRoutes(pool));


// 🤖 Chatbot Route (OpenAI)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chatbot", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a supportive AI wellness chatbot." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong!" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Booking API endpoints active.`);
});