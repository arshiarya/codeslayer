import express from 'express';
import pool from '../config/db.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Get all posts (with pagination)
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = `
            SELECT 
                p.*, 
                COUNT(DISTINCT c.comment_id) as comment_count,
                COUNT(DISTINCT r.reaction_id) as reaction_count
            FROM community_posts p
            LEFT JOIN post_comments c ON p.post_id = c.post_id
            LEFT JOIN post_reactions r ON p.post_id = r.post_id
            WHERE p.status = 'active'
        `;

        const values = [];
        if (category) {
            query += ` AND p.category = $1`;
            values.push(category);
        }

        query += `
            GROUP BY p.post_id
            ORDER BY p.created_at DESC
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}
        `;
        values.push(limit, offset);

        const { rows } = await pool.query(query, values);
        
        // Get total count for pagination
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM community_posts WHERE status = $1',
            ['active']
        );
        
        res.json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch posts',
            error: error.message 
        });
    }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    const { title, content, category, is_anonymous = false } = req.body;
    const userId = req.userId;

    try {
        const query = `
            INSERT INTO community_posts 
                (user_id, title, content, category, is_anonymous)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [
            userId, title, content, category, is_anonymous
        ]);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
});

// Get a specific post with its comments
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        // Get post details
        const postQuery = `
            SELECT 
                p.*,
                COUNT(DISTINCT r.reaction_id) as reaction_count
            FROM community_posts p
            LEFT JOIN post_reactions r ON p.post_id = r.post_id
            WHERE p.post_id = $1 AND p.status = 'active'
            GROUP BY p.post_id
        `;
        const postResult = await pool.query(postQuery, [postId]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Get comments
        const commentsQuery = `
            SELECT *
            FROM post_comments
            WHERE post_id = $1 AND status = 'active'
            ORDER BY created_at ASC
        `;
        const commentsResult = await pool.query(commentsQuery, [postId]);

        res.json({
            success: true,
            data: {
                post: postResult.rows[0],
                comments: commentsResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
});

// Add a comment to a post
router.post('/:postId/comments', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const { content, is_anonymous = false, parent_comment_id = null } = req.body;
    const userId = req.userId;

    try {
        const query = `
            INSERT INTO post_comments 
                (post_id, user_id, content, is_anonymous, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [
            postId, userId, content, is_anonymous, parent_comment_id
        ]);

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
});

// React to a post
router.post('/:postId/react', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const { reaction_type } = req.body;
    const userId = req.userId;

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Check if user already reacted
        const checkQuery = `
            SELECT reaction_id, reaction_type 
            FROM post_reactions 
            WHERE post_id = $1 AND user_id = $2
        `;
        const checkResult = await client.query(checkQuery, [postId, userId]);

        if (checkResult.rows.length > 0) {
            // User already reacted - update the reaction
            const updateQuery = `
                UPDATE post_reactions
                SET reaction_type = $1
                WHERE post_id = $2 AND user_id = $3
                RETURNING *
            `;
            const { rows } = await client.query(updateQuery, [
                reaction_type, postId, userId
            ]);

            await client.query('COMMIT');
            res.json({
                success: true,
                message: 'Reaction updated',
                data: rows[0]
            });
        } else {
            // New reaction
            const insertQuery = `
                INSERT INTO post_reactions (post_id, user_id, reaction_type)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const { rows } = await client.query(insertQuery, [
                postId, userId, reaction_type
            ]);

            await client.query('COMMIT');
            res.status(201).json({
                success: true,
                message: 'Reaction added',
                data: rows[0]
            });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error managing reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to manage reaction',
            error: error.message
        });
    } finally {
        client.release();
    }
});

// Delete a post (soft delete)
router.delete('/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    try {
        const query = `
            UPDATE community_posts
            SET status = 'deleted'
            WHERE post_id = $1 AND user_id = $2
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [postId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or you do not have permission to delete it'
            });
        }

        res.json({
            success: true,
            message: 'Post deleted successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
            error: error.message
        });
    }
});

export default router;