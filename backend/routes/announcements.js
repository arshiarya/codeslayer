import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get upcoming announcements
router.get('/', async (req, res) => {
	const today = new Date().toISOString();
	try {
		const result = await pool.query(
			'SELECT id, title, description, date FROM announcements WHERE date >= $1 ORDER BY date ASC',
			[today]
		);
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching announcements:', error);
		res.status(500).json({ message: 'Failed to fetch announcements.' });
	}
});

// Add a new announcement
router.post('/', async (req, res) => {
	const { title, description, date } = req.body;
	if (!title || !description || !date) return res.status(400).json({ message: 'Missing fields' });
	try {
		const insert = `INSERT INTO announcements (title, description, date) VALUES ($1, $2, $3) RETURNING *`;
		const result = await pool.query(insert, [title, description, date]);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error('Error adding announcement:', error);
		res.status(400).json({ message: 'Failed to add announcement. Invalid data.' });
	}
});

export default router;