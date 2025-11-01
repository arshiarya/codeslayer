// chatController.js
import pool from './config/db.js';
import { generateAnonymousName } from './identityGenerator.js';

// 1. Logic for POST /api/chat/join/:roomId
export async function joinRoom(req, res) {
    // IMPORTANT: Ensure your auth middleware sets req.userId
    const userId = req.userId; 
    const roomId = req.params.roomId;

    try {
        // A. Check for existing identity
        let result = await pool.query(
            "SELECT identity_id, anonymous_name FROM chat_identities WHERE user_id = $1 AND room_id = $2", 
            [userId, roomId]
        );

        if (result.rowCount === 0) {
            // B. Create new identity if it doesn't exist
            const newAnonName = await generateAnonymousName(roomId);
            result = await pool.query(
                "INSERT INTO chat_identities (user_id, room_id, anonymous_name) VALUES ($1, $2, $3) RETURNING identity_id, anonymous_name",
                [userId, roomId, newAnonName]
            );
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).send("Failed to join room.");
    }
}


// 2. Logic for POST /api/moderation/flag/:messageId
export async function flagMessage(req, res) {
    const reporterUserId = req.userId; 
    const messageId = req.params.messageId;
    const reason = req.body.reason;

    try {
        const flagQuery = `
            INSERT INTO message_flags (message_id, reporter_user_id, reason) 
            VALUES ($1, $2, $3)
            ON CONFLICT (message_id, reporter_user_id) DO NOTHING;
        `;
        await pool.query(flagQuery, [messageId, reporterUserId, reason]);
        
        // Add flag threshold check logic here later
        
        res.status(202).send({ status: "Flag recorded." });
    } catch (error) {
        console.error("Error flagging message:", error);
        res.status(500).send("Failed to record flag.");
    }
}