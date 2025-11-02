import express from 'express';
import pool from '../config/db.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Submit a new reach out request
router.post('/', authenticateToken, async (req, res) => {
    const {
        title,
        content,
        category,
        urgency_level,
        is_anonymous = false
    } = req.body;
    const userId = req.userId;

    try {
        const query = `
            INSERT INTO reach_out_submissions
                (user_id, title, content, category, urgency_level, is_anonymous)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [
            userId,
            title,
            content,
            category,
            urgency_level,
            is_anonymous
        ]);

        res.status(201).json({
            success: true,
            message: 'Reach out submission received',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error creating reach out submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit reach out request',
            error: error.message
        });
    }
});

// Get user's own reach out submissions
router.get('/my-submissions', authenticateToken, async (req, res) => {
    const userId = req.userId;
    const { status } = req.query;

    try {
        let query = `
            SELECT *
            FROM reach_out_submissions
            WHERE user_id = $1
        `;
        const values = [userId];

        if (status) {
            query += ` AND status = $2`;
            values.push(status);
        }

        query += ` ORDER BY created_at DESC`;

        const { rows } = await pool.query(query, values);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message
        });
    }
});

// Get a specific submission
router.get('/:submissionId', authenticateToken, async (req, res) => {
    const { submissionId } = req.params;
    const userId = req.userId;

    try {
        const query = `
            SELECT *
            FROM reach_out_submissions
            WHERE submission_id = $1 AND user_id = $2
        `;
        
        const { rows } = await pool.query(query, [submissionId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submission',
            error: error.message
        });
    }
});

// Update a submission (e.g., cancel it)
router.patch('/:submissionId', authenticateToken, async (req, res) => {
    const { submissionId } = req.params;
    const userId = req.userId;
    const { status } = req.body;

    // Only allow users to cancel their own submissions
    if (status !== 'cancelled') {
        return res.status(400).json({
            success: false,
            message: 'Invalid status update'
        });
    }

    try {
        const query = `
            UPDATE reach_out_submissions
            SET status = $1
            WHERE submission_id = $2 AND user_id = $3 AND status = 'pending'
            RETURNING *
        `;
        
        const { rows } = await pool.query(query, [status, submissionId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found or cannot be cancelled'
            });
        }

        res.json({
            success: true,
            message: 'Submission updated successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error updating submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: error.message
        });
    }
});

// Admin Routes (these should be protected by additional middleware)

// Get all submissions (for admins/counselors)
router.get('/admin/all', authenticateToken, async (req, res) => {
    const { status, urgency_level } = req.query;
    // TODO: Add admin role check middleware

    try {
        let query = `
            SELECT *
            FROM reach_out_submissions
            WHERE 1=1
        `;
        const values = [];

        if (status) {
            values.push(status);
            query += ` AND status = $${values.length}`;
        }

        if (urgency_level) {
            values.push(urgency_level);
            query += ` AND urgency_level = $${values.length}`;
        }

        query += ` ORDER BY created_at DESC`;

        const { rows } = await pool.query(query, values);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message
        });
    }
});

// Assign/update submission (for admins/counselors)
router.patch('/admin/:submissionId', authenticateToken, async (req, res) => {
    const { submissionId } = req.params;
    const { status, assigned_to } = req.body;
    // TODO: Add admin role check middleware

    try {
        let query = `
            UPDATE reach_out_submissions
            SET status = $1
        `;
        const values = [status];

        if (assigned_to) {
            query += `, assigned_to = $${values.length + 1}`;
            values.push(assigned_to);
        }

        if (status === 'resolved') {
            query += `, resolved_at = CURRENT_TIMESTAMP`;
        }

        query += ` WHERE submission_id = $${values.length + 1} RETURNING *`;
        values.push(submissionId);

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            message: 'Submission updated successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error updating submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: error.message
        });
    }
});

export default router;