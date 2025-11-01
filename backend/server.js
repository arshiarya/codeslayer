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
import http from 'http';
import { Server } from 'socket.io'; 

// --- ROUTE IMPORTS ---
import { authRoutes } from "./routes/auth.js"; 
import announcementsRoutes from "./routes/announcements.js";
import storiesRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import usersRoutes from "./routes/users.js";
import chatBotRoutes from "./routes/chatServer.js"; // Gemini/AI Chatbot
import assessmentRoutes from "./routes/assessmentRoutes.js";
import moodRoutes from "./routes/moodRoutes.js"; 
import userStatsRoutes from "./routes/userStatsRoutes.js"; // This often handles dashboard stats

// --- MIDDLEWARE/CONFIG IMPORTS ---
import pool from "./config/db.js"; // PostgreSQL connection pool
import authenticateToken from './middleware/authenticateToken.js'; // JWT Middleware
import { handleSockets } from './socketHandler.js'; // Socket.IO handler
import { joinRoom, flagMessage } from './chatController.js'; // Chat HTTP controllers

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Use ENV var

// 🛠️ Setup HTTP and Socket.IO servers
const server = http.createServer(app); 
const io = new Server(server, { 
    cors: {
        origin: FRONTEND_URL, 
        methods: ["GET", "POST"],
        credentials: true
    }
}); 

// ----------------------------------------------------
//                🌐 CORE MIDDLEWARE
// ----------------------------------------------------

// ✅ HTTP CORS
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(express.json()); 

// ----------------------------------------------------
//                🔗 DATABASE CONNECTION
// ----------------------------------------------------

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Ensure refresh_tokens table exists in Postgres
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
    }
}
ensureRefreshTokensTable();

// ----------------------------------------------------
//            📊 ADMIN DASHBOARD ROUTES (NEW/MODIFIED)
// ----------------------------------------------------

// 1. GET /api/dashboard/stats (Aggregated KPIs)
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        // QUERY 1: Total Users
        const totalUsersResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalUsers = totalUsersResult.rows[0].count;

        // QUERY 2: Check-ins Today (Assuming 'mood_entries' is the check-in table)
        const checkinsResult = await pool.query(`
            SELECT COUNT(*) FROM mood_entries 
            WHERE check_in_date >= CURRENT_DATE AND check_in_date < CURRENT_DATE + interval '1 day';
        `);
        // NOTE: Adjusted 'entry_date' to 'check_in_date' for consistency with common schemas.
        const checkinsToday = checkinsResult.rows[0].count;

        // ✅ MODIFIED: Average Mood Score (Using 'mood_entries' and 'mood_rating')
        const avgMoodResult = await pool.query('SELECT TRUNC(AVG(mood_rating), 1) AS avg_score FROM mood_entries');
        const averageMoodScore = avgMoodResult.rows[0].avg_score;

        // QUERY 4: Flagged Content Count (Using 'message_flags')
        const flaggedContentResult = await pool.query('SELECT COUNT(*) FROM message_flags');
        const flaggedContentCount = flaggedContentResult.rows[0].count;

        // Mock/Assumed Stats (You'd replace these with real queries)
        const activeUsers = Math.floor(totalUsers * 0.6); // Active this month
        const assessmentsToday = 97; // Assessments Today

        const dashboardStats = {
            totalUsers: totalUsers,
            activeThisMonth: activeUsers,
            checkinsToday: checkinsToday,
            averageMoodScore: averageMoodScore, // Fetched from 'mood_entries'
            assessmentsToday: assessmentsToday,
            flaggedContent: flaggedContentCount // Fetched from 'message_flags'
        };

        res.json(dashboardStats);

    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. ✅ MODIFIED: GET /api/dashboard/growth (Daily Registrations Chart Data)
app.get('/api/dashboard/growth', async (req, res) => {
    try {
        const growthDataResult = await pool.query(`
            SELECT 
                TO_CHAR(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
                COUNT(*) AS users
            FROM users
            WHERE created_at >= NOW() - INTERVAL '30 days' -- Last 30 days
            GROUP BY 1
            ORDER BY 1;
        `);

        // Map the database rows to the expected {day: 'YYYY-MM-DD', users: N} format
        const dailyGrowthData = growthDataResult.rows.map(row => ({
            day: row.day,
            users: parseInt(row.users, 10)
        }));

        res.json(dailyGrowthData); 
        
    } catch (err) {
        console.error('Error fetching daily growth data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. 🆕 NEW ROUTE: GET /api/dashboard/mood-trend (Daily Average Mood Score Chart Data)
app.get('/api/dashboard/mood-trend', async (req, res) => {
    try {
        const moodTrendResult = await pool.query(`
            SELECT 
                TO_CHAR(check_in_date, 'YYYY-MM-DD') AS day,
                TRUNC(AVG(mood_rating), 1) AS average_mood
            FROM 
                mood_entries
            WHERE 
                check_in_date >= NOW() - INTERVAL '30 days' -- Last 30 days
            GROUP BY 
                1
            ORDER BY 
                1 ASC;
        `);

        const dailyMoodData = moodTrendResult.rows.map(row => ({
            day: row.day,
            // Ensure average_mood is returned as a number
            average_mood: parseFloat(row.average_mood) 
        }));

        res.json(dailyMoodData); 
        
    } catch (err) {
        console.error('Error fetching daily mood trend data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ----------------------------------------------------
//          🛡️ COUNSELLING BOOKING ROUTES (PostgreSQL)
// ----------------------------------------------------
// ... (Booking routes 1, 2, 3, 4 remain unchanged) ...
app.get('/api/counsellors/availability', async (req, res) => { /* ... */ });
app.get('/api/bookings/my-appointments', authenticateToken, async (req, res) => { /* ... */ });
app.get('/api/bookings/my-past-sessions', authenticateToken, async (req, res) => { /* ... */ });
app.post('/api/bookings/create', authenticateToken, async (req, res) => { /* ... */ });


// ----------------------------------------------------
//          👤 ANONYMOUS CHAT ROUTES (PostgreSQL)
// ----------------------------------------------------
// ... (Chat routes remain unchanged) ...
app.post('/api/chat/join/:roomId', authenticateToken, joinRoom);
app.post('/api/moderation/flag/:messageId', authenticateToken, flagMessage);


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

// 🤖 Gemini ChatBot Routes (Dedicated)
app.use("/api/gemini-chat", chatBotRoutes);

// 📊 Assessment Routes
app.use("/api/assessment", assessmentRoutes(pool));

// 🎭 MOOD TRACKER & STATS ROUTES
app.use("/api/mood", moodRoutes(pool)); 
app.use("/api/user-stats", userStatsRoutes(pool));


// ----------------------------------------------------
// ❌ REMOVED: Redundant OpenAI Chatbot Route.
// ----------------------------------------------------

// ----------------------------------------------------
//                📡 SOCKET.IO SETUP
// ----------------------------------------------------

// 🛠️ Attach Socket.IO handlers to the server instance
handleSockets(io);

// ----------------------------------------------------
//                  🚀 SERVER START
// ----------------------------------------------------

// Listen on the HTTP server, not the Express app
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Booking API endpoints active.`);
  console.log(`💬 WebSocket server ready for chat connections.`);
});