import express from 'express';
import pool from '../config/db.js';

const router = express.Router();
const FLAGS_TO_DELETE = 5;

// Get all messages
router.get('/', async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT id, user_id, avatar_url, content, likes, flags, created_at FROM chat_messages WHERE flags < $1 ORDER BY created_at DESC LIMIT 200', [FLAGS_TO_DELETE]);
		res.json(rows);
	} catch (error) {
		console.error('Error fetching chat messages:', error);
		res.status(500).json({ message: 'Failed to retrieve messages.' });
	}
});

// Post a new message
router.post('/', async (req, res) => {
	const { userId, avatarUrl, content } = req.body;
	if (!content) return res.status(400).json({ message: 'Missing content' });
	try {
		const insert = `INSERT INTO chat_messages (user_id, avatar_url, content) VALUES ($1, $2, $3) RETURNING *`;
		const { rows } = await pool.query(insert, [userId || null, avatarUrl || null, content]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error('Error posting new message:', error);
		res.status(400).json({ message: 'Invalid message data.' });
	}
});

// Reply to a message
router.post('/:id/reply', async (req, res) => {
	const { userId, avatarUrl, content } = req.body;
	if (!content) return res.status(400).json({ message: 'Missing content' });
	try {
		const insert = `INSERT INTO chat_replies (message_id, user_id, avatar_url, content) VALUES ($1, $2, $3, $4) RETURNING *`;
		const { rows } = await pool.query(insert, [req.params.id, userId || null, avatarUrl || null, content]);
		res.json(rows[0]);
	} catch (error) {
		console.error('Error adding reply:', error);
		res.status(500).json({ message: 'Failed to add reply.' });
	}
});

// Like a message
router.post('/:id/like', async (req, res) => {
	try {
		const { rows } = await pool.query('UPDATE chat_messages SET likes = likes + 1 WHERE id = $1 RETURNING *', [req.params.id]);
		res.json(rows[0]);
	} catch (error) {
		console.error('Error liking message:', error);
		res.status(500).json({ message: 'Failed to like message.' });
	}
});

// Flag a message
router.post('/:id/flag', async (req, res) => {
	try {
		const { rows } = await pool.query('UPDATE chat_messages SET flags = flags + 1 WHERE id = $1 RETURNING flags', [req.params.id]);
		if (!rows[0]) return res.status(404).json({ message: 'Message not found.' });
		const currentFlags = parseInt(rows[0].flags, 10);
		if (currentFlags >= FLAGS_TO_DELETE) {
			await pool.query('DELETE FROM chat_messages WHERE id = $1', [req.params.id]);
			return res.json({ status: 'deleted due to flags' });
		}
		res.json({ status: 'flagged', flags: currentFlags });
	} catch (error) {
		console.error('Error flagging message:', error);
		res.status(500).json({ message: 'Failed to flag message.' });
	}
});

export default router;