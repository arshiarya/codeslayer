import express from 'express';
import pool from '../config/db.js';

const router = express.Router();
const FLAGS_TO_DELETE = 5;

// GET all stories (excluding flagged) with user details
router.get('/', async (req, res) => {
    try {
        const q = `
            SELECT s.id, s.user_id, s.content, s.likes, s.flags, s.created_at,
                   u.*
            FROM stories s
            LEFT JOIN users u ON u.id = s.user_id
            WHERE s.flags < $1
            ORDER BY s.created_at DESC
            LIMIT 100;
        `;
        const { rows } = await pool.query(q, [FLAGS_TO_DELETE]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Failed to fetch stories.' });
    }
});

// Post a new story
router.post('/', async (req, res) => {
    const { userId, content, username, avatarUrl } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // First ensure the user exists
        let userResult;
        if (username && avatarUrl) {
            // Create or update user
            userResult = await client.query(
                `INSERT INTO users (id, username, avatar_url) 
                 VALUES ($1, $2, $3)
                 ON CONFLICT (id) DO UPDATE 
                 SET username = EXCLUDED.username,
                     avatar_url = EXCLUDED.avatar_url
                 RETURNING id`,
                [userId, username, avatarUrl]
            );
        } else {
            // Just check if user exists
            userResult = await client.query(
                'SELECT id FROM users WHERE id = $1',
                [userId]
            );
        }

        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Invalid user' });
        }

        // Then create the story
        const insert = `INSERT INTO stories (user_id, content) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(insert, [userId, content]);
        const story = result.rows[0];

        // Get the full story with user details
        const populated = await client.query(
            `SELECT s.*, 
                    u.username, u.avatar_url, 
                    (SELECT COUNT(*) FROM story_comments WHERE story_id = s.id) as comment_count
             FROM stories s
             LEFT JOIN users u ON u.id = s.user_id 
             WHERE s.id = $1`,
            [story.id]
        );

        await client.query('COMMIT');
        res.status(201).json({
            success: true,
            data: populated.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error posting story:', error);
        res.status(400).json({ 
            success: false,
            message: 'Invalid story data.',
            error: error.message
        });
    } finally {
        client.release();
    }
});

// Like a story
router.post('/:id/like', async (req, res) => {
    try {
        const q = `UPDATE stories SET likes = likes + 1 WHERE id = $1 RETURNING *`;
        const { rows } = await pool.query(q, [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error liking story:', error);
        res.status(500).json({ message: 'Failed to like story.' });
    }
});

// Comment on a story
router.post('/:id/comment', async (req, res) => {
    const { userId, content } = req.body;
    const storyId = req.params.id;
    if (!userId || !content) return res.status(400).json({ message: 'Missing fields' });
    try {
        const insert = `INSERT INTO story_comments (story_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`;
        await pool.query(insert, [storyId, userId, content]);
        // return the story with comments
    const storyQ = `SELECT s.*, u.* FROM stories s LEFT JOIN users u ON u.id = s.user_id WHERE s.id = $1`;
        const storyRes = await pool.query(storyQ, [storyId]);
    const commentsRes = await pool.query('SELECT sc.*, u.* FROM story_comments sc LEFT JOIN users u ON u.id = sc.user_id WHERE sc.story_id = $1 ORDER BY sc.created_at ASC', [storyId]);
        const combined = { ...storyRes.rows[0], comments: commentsRes.rows };
        res.status(200).json(combined);
    } catch (error) {
        console.error('Error commenting on story:', error);
        res.status(500).json({ message: 'Failed to add comment due to server error.' });
    }
});

// Flag a story
router.post('/:id/flag', async (req, res) => {
    try {
        const q = `UPDATE stories SET flags = flags + 1 WHERE id = $1 RETURNING flags`;
        const { rows } = await pool.query(q, [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: 'Story not found.' });
        const currentFlags = parseInt(rows[0].flags, 10);
        if (currentFlags >= FLAGS_TO_DELETE) {
            await pool.query('DELETE FROM stories WHERE id = $1', [req.params.id]);
            return res.status(200).json({ status: 'deleted', message: `Story deleted after reaching ${FLAGS_TO_DELETE} flags.` });
        }
        res.status(200).json({ status: 'flagged', flags: currentFlags, message: `Story flagged. Current count: ${currentFlags}/${FLAGS_TO_DELETE}` });
    } catch (error) {
        console.error('Error flagging story:', error);
        res.status(500).json({ message: 'Failed to flag story.' });
    }
});

// Get latest contributors
router.get('/contributors/latest', async (req, res) => {
    try {
        const q = `SELECT DISTINCT user_id FROM stories WHERE flags < $1 ORDER BY created_at DESC LIMIT 10`;
        const idsRes = await pool.query(q, [FLAGS_TO_DELETE]);
        const ids = idsRes.rows.map(r => r.user_id).filter(Boolean);
        const top3 = ids.slice(0, 3);
        const moreCount = Math.max(0, ids.length - 3);
        let avatars = [];
        if (top3.length) {
            const usersRes = await pool.query('SELECT id, avatar_url FROM users WHERE id = ANY($1::int[])', [top3]);
            avatars = top3.map(uid => {
                const u = usersRes.rows.find(x => x.id === uid);
                return { userId: uid, avatarUrl: u?.avatar_url };
            });
        }
        res.json({ avatars, moreCount });
    } catch (error) {
        console.error('Error fetching contributors:', error);
        res.status(500).json({ message: 'Failed to fetch contributors.' });
    }
});

export default router;