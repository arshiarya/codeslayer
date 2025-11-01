// socketHandler.js
import pool from "./config/db.js";

export function handleSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New user connected:", socket.id);

    // ✅ Join Room
    socket.on("joinRoom", (roomId, identityId) => {
      if (!roomId || !identityId) return;

      socket.join(`room-${roomId}`);
      socket.identityId = identityId;
      socket.roomId = roomId;

      console.log(`👥 User ${identityId} joined room-${roomId}`);
      socket.emit("joinedRoom", { success: true, roomId });
    });

    // ✅ Send Message
    socket.on("sendMessage", async (data) => {
      const { text } = data;
      const roomId = socket.roomId;
      const identityId = socket.identityId;

      if (!text || !roomId || !identityId) return;

      try {
        // 1️⃣ Save message in DB
        const saveQuery = `
          INSERT INTO messages (room_id, sender_identity_id, message_text)
          VALUES ($1, $2, $3)
          RETURNING message_id, created_at;
        `;
        const result = await pool.query(saveQuery, [roomId, identityId, text]);
        const messageId = result.rows[0].message_id;
        const timestamp = result.rows[0].created_at;

        // 2️⃣ Fetch anonymous name
        const nameResult = await pool.query(
          "SELECT anonymous_name FROM chat_identities WHERE identity_id = $1",
          [identityId]
        );

        const anonymousName =
          nameResult.rows.length > 0
            ? nameResult.rows[0].anonymous_name
            : "Anonymous";

        // 3️⃣ Broadcast message to room
        const messagePayload = {
          messageId,
          sender: anonymousName,
          text,
          timestamp,
        };

        io.to(`room-${roomId}`).emit("newMessage", messagePayload);
      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("errorMessage", {
          error: "Message could not be sent. Please try again.",
        });
      }
    });

    // ✅ Handle disconnects
    socket.on("disconnect", () => {
      console.log(`❎ User disconnected: ${socket.id}`);
    });
  });
}
