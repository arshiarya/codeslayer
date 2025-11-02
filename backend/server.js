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
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// 🛠️ NEW: Import for HTTP and Socket.IO
import http from 'http';
import { Server } from 'socket.io'; 

// --- ROUTE IMPORTS ---
import { authRoutes } from "./routes/auth.js"; 
import announcementsRoutes from "./routes/announcements.js";
import storiesRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import usersRoutes from "./routes/users.js";
import chatBotRoutes from "./routes/chatServer.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import moodRoutes from "./routes/moodRoutes.js"; 
import userStatsRoutes from "./routes/userStatsRoutes.js";

// --- MIDDLEWARE/CONFIG IMPORTS ---
import pool from "./config/db.js"; // PostgreSQL connection pool
import authenticateToken from './middleware/authenticateToken.js'; // JWT Middleware
import { handleSockets } from './socketHandler.js'; // Socket.IO handler
import { joinRoom, flagMessage } from './chatController.js'; // Chat HTTP controllers
// Import new community routes
import communityPostsRoutes from './routes/communityPosts.js';
import reachOutRoutes from './routes/reachOutRoutes.js';
import mongoose from 'mongoose'; // 🛠️ NEW: Import Mongoose for MongoDB
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// 🛠️ NEW: Create HTTP server instance from Express app
const server = http.createServer(app); 
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('✅ MongoDB connected successfully!');
            // You can call ensure-table functions for Mongo models here if needed
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            // Optionally exit the process if MongoDB is critical
            // process.exit(1); 
        });
} else {
    console.warn('⚠️ MONGO_URI not found. MongoDB features will be disabled.');
}
// 🛠️ NEW: Initialize Socket.IO server on the HTTP server
// CRITICAL FIX: Add CORS configuration for WebSockets
const io = new Server(server, { 
    cors: {
        // Allows the frontend (running on 3000) to connect for WebSockets
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true
    }
}); 

// ----------------------------------------------------
//                🌐 CORE MIDDLEWARE
// ----------------------------------------------------

// ✅ Allow frontend to connect for HTTP requests (adjust port if needed)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.json()); 

// ----------------------------------------------------
//                🔗 DATABASE CONNECTION
// ----------------------------------------------------

// Note: MongoDB / Mongoose removed. The project uses PostgreSQL (see config/db.js)

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

// Ensure announcements, stories, chat and users tables
async function ensureAnnouncementsTable() {
    try {
        const createSql = `
            CREATE TABLE IF NOT EXISTS announcements (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                date TIMESTAMP NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
        `;
        await pool.query(createSql);
        console.log('✅ announcements table ensured');
    } catch (err) {
        console.warn('Could not ensure announcements table at startup:', err.message);
    }
}
async function ensureUsersTable() {
    try {
        const createSql = `
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                avatar_url TEXT,
                email TEXT UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );

            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        `;
        await pool.query(createSql);
        console.log('✅ users table ensured');
    } catch (err) {
        console.warn('Could not ensure users table at startup:', err.message);
    }
}
async function ensureStoriesAndCommentsTables() {
    try {
        const createStories = `
            CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                user_id TEXT REFERENCES users(id),
                content TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                flags INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );

            CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
            CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
        `;
        const createComments = `
            CREATE TABLE IF NOT EXISTS story_comments (
                id SERIAL PRIMARY KEY,
                story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
                user_id TEXT REFERENCES users(id),
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );

            CREATE INDEX IF NOT EXISTS idx_comments_story_id ON story_comments(story_id);
            CREATE INDEX IF NOT EXISTS idx_comments_user_id ON story_comments(user_id);
            CREATE INDEX IF NOT EXISTS idx_comments_created_at ON story_comments(created_at);
        `;
        await pool.query(createStories);
        await pool.query(createComments);
        console.log('✅ stories and story_comments tables ensured');
    } catch (err) {
        console.warn('Could not ensure stories/comments tables at startup:', err.message);
    }
}
async function ensureChatTables() {
    try {
        const createMessages = `
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                avatar_url TEXT,
                content TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                flags INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
        `;
        const createReplies = `
            CREATE TABLE IF NOT EXISTS chat_replies (
                id SERIAL PRIMARY KEY,
                message_id INTEGER REFERENCES chat_messages(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id),
                avatar_url TEXT,
                content TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
        `;
        await pool.query(createMessages);
        await pool.query(createReplies);
        console.log('✅ chat_messages and chat_replies tables ensured');
    } catch (err) {
        console.warn('Could not ensure chat tables at startup:', err.message);
    }
}

// Call ensures (best-effort)
ensureAnnouncementsTable();
ensureUsersTable();
ensureStoriesAndCommentsTables();
ensureChatTables();

// Ensure community tables exist
async function ensureCommunityTables() {
    try {
        // Read and execute the community tables SQL
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        const sql = fs.readFileSync(
            path.join(__dirname, 'migrations', 'community_tables.sql'),
            'utf8'
        );
        
        await pool.query(sql);
        console.log('✅ Community tables ensured');
    } catch (err) {
        console.warn('Could not ensure community tables:', err.message);
    }
}

// Call ensure community tables
ensureCommunityTables();

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

// 2. 🔒 GET /api/bookings/my-appointments (Upcoming/Current - Requires JWT)
app.get('/api/bookings/my-appointments', authenticateToken, async (req, res) => {
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


// 3. 🔒 GET /api/bookings/my-past-sessions (PREVIOUS SESSIONS - Fixes 404)
app.get('/api/bookings/my-past-sessions', authenticateToken, async (req, res) => {
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
                AND cs.schedule_date < CURRENT_DATE -- Only past dates
                AND br.status IN ('Completed', 'Confirmed') 
            ORDER BY 
                cs.schedule_date DESC, cs.schedule_time DESC; 
        `;
        const { rows } = await pool.query(query, [studentEnrollmentNumber]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching secure past student sessions:", err);
        res.status(500).json({ error: "Failed to retrieve past session history." });
    }
});


// 4. 🔒 POST /api/bookings/create (Requires JWT + Transaction)
app.post('/api/bookings/create', authenticateToken, async (req, res) => {
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
//          👤 ANONYMOUS CHAT ROUTES (PostgreSQL)
// ----------------------------------------------------

// 1. 🔒 POST /api/chat/join/:roomId (HTTP - Get/Create Pseudonym)
app.post('/api/chat/join/:roomId', authenticateToken, joinRoom);

// 2. 🔒 POST /api/moderation/flag/:messageId (HTTP - Submit Flag)
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

// 🌐 Community Routes (NEW)
app.use("/api/community/posts", communityPostsRoutes);
app.use("/api/reach-out", reachOutRoutes);

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

// ----------------------------------------------------
//                📡 SOCKET.IO SETUP
// ----------------------------------------------------

// 🛠️ Attach Socket.IO handlers to the server instance
handleSockets(io);

// ----------------------------------------------------
//                  🚀 SERVER START
// ----------------------------------------------------

// Listen on the HTTP server, not the Express app
function startServer(startPort, attemptsLeft = 10) {
    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            const nextPort = startPort + 1;
            if (attemptsLeft > 0) {
                console.warn(`Port ${startPort} in use, trying ${nextPort}... (${attemptsLeft - 1} attempts left)`);
                // Remove previous listeners and try again
                server.removeAllListeners('error');
                startServer(nextPort, attemptsLeft - 1);
            } else {
                console.error('Could not find an open port to bind the server. Exiting.');
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });

    server.listen(startPort, () => {
        console.log(`✅ Server running on http://localhost:${startPort}`);
        console.log(`📡 Booking API endpoints active.`);
        console.log(`💬 WebSocket server ready for chat connections.`);
    });
}

startServer(PORT);