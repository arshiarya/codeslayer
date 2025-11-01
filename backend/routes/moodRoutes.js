import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';

const moodRoutes = (pool) => {
    const router = express.Router();

    // ------------------------------
    // GET /api/mood/stats
    // Get comprehensive mood statistics
    // ------------------------------
    router.get('/stats', authenticateToken, async (req, res) => {
        const userId = req.userId;

        try {
            // 1. Get average mood and total entries (last 30 days)
            const avgQuery = `
                SELECT 
                    ROUND(AVG(mood_rating)::numeric, 1) as avg_mood,
                    COUNT(*) as total_entries
                FROM mood_entries
                WHERE user_id = $1 
                    AND check_in_date >= CURRENT_DATE - INTERVAL '30 days'
            `;

            // 2. Calculate current streak (consecutive days)
            const streakQuery = `
                WITH RECURSIVE date_check AS (
                    -- Start from today (cast to DATE)
                    SELECT 
                        CURRENT_DATE::date as check_date,
                        CASE WHEN EXISTS (
                            SELECT 1 FROM mood_entries 
                            WHERE user_id = $1 AND check_in_date = CURRENT_DATE
                        ) THEN 1 ELSE 0 END as has_entry
                    
                    UNION ALL
                    
                    -- Go backwards day by day
                    SELECT 
                        (dc.check_date - INTERVAL '1 day')::date,
                        CASE WHEN EXISTS (
                            SELECT 1 FROM mood_entries 
                            WHERE user_id = $1 
                            AND check_in_date = (dc.check_date - INTERVAL '1 day')::date
                        ) THEN 1 ELSE 0 END
                    FROM date_check dc
                    WHERE dc.has_entry = 1 
                        AND dc.check_date > (CURRENT_DATE - INTERVAL '365 days')::date
                )
                SELECT COUNT(*) as current_streak
                FROM date_check
                WHERE has_entry = 1
            `;

            // 3. Get longest streak
            const longestStreakQuery = `
                WITH date_series AS (
                    SELECT DISTINCT check_in_date
                    FROM mood_entries
                    WHERE user_id = $1
                    ORDER BY check_in_date
                ),
                streak_groups AS (
                    SELECT 
                        check_in_date,
                        check_in_date - (ROW_NUMBER() OVER (ORDER BY check_in_date))::int AS streak_group
                    FROM date_series
                )
                SELECT COALESCE(MAX(streak_length), 0) as longest_streak
                FROM (
                    SELECT COUNT(*) as streak_length
                    FROM streak_groups
                    GROUP BY streak_group
                ) sub
            `;

            // 4. Get date of first mood entry (first use)
            const firstUseQuery = `
                SELECT MIN(check_in_date) as first_use_date
                FROM mood_entries
                WHERE user_id = $1
            `;

            const [avgResult, streakResult, longestStreakResult, firstUseResult] = await Promise.all([
                pool.query(avgQuery, [userId]),
                pool.query(streakQuery, [userId]),
                pool.query(longestStreakQuery, [userId]),
                pool.query(firstUseQuery, [userId])
            ]);

            res.json({
                success: true,
                data: {
                    averageMood: parseFloat(avgResult.rows[0].avg_mood) || 0,
                    totalEntries: parseInt(avgResult.rows[0].total_entries) || 0,
                    currentStreak: parseInt(streakResult.rows[0].current_streak) || 0,
                    longestStreak: parseInt(longestStreakResult.rows[0].longest_streak) || 0,
                    firstUseDate: firstUseResult.rows[0].first_use_date || null
                }
            });

        } catch (error) {
            console.error('Error fetching mood stats:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to retrieve mood statistics.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // GET /api/mood/average
    // Get overall average mood rating across all users
    // ------------------------------
    router.get('/average', authenticateToken, async (req, res) => {
        try {
            const query = `
                SELECT ROUND(AVG(mood_rating)::numeric, 1) AS avg_mood, COUNT(*) AS total_entries
                FROM mood_entries
            `;

            const result = await pool.query(query);
            res.json({
                success: true,
                data: {
                    averageMood: parseFloat(result.rows[0].avg_mood) || 0,
                    totalEntries: parseInt(result.rows[0].total_entries) || 0
                }
            });
        } catch (error) {
            console.error('Error fetching overall average mood:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve average mood.', error: error.message });
        }
    });

    // ------------------------------
    // GET /api/mood/trend
    // Get mood trend data for chart (last N days)
    // ------------------------------
    router.get('/trend', authenticateToken, async (req, res) => {
        const userId = req.userId;
        const days = parseInt(req.query.days) || 30;

        const queryText = `
            SELECT 
                check_in_date,
                mood_rating,
                notes
            FROM mood_entries
            WHERE user_id = $1 
                AND check_in_date >= CURRENT_DATE - INTERVAL '${days} days'
            ORDER BY check_in_date ASC
        `;

        try {
            const result = await pool.query(queryText, [userId]);
            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Error fetching mood trend:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to retrieve mood trend data.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // GET /api/mood/today
    // Get today's mood entry
    // ------------------------------
    router.get('/today', authenticateToken, async (req, res) => {
        const userId = req.userId;

        const queryText = `
            SELECT * FROM mood_entries
            WHERE user_id = $1 AND check_in_date = CURRENT_DATE
        `;

        try {
            const result = await pool.query(queryText, [userId]);
            res.json({
                success: true,
                data: result.rows[0] || null,
                hasEntry: result.rows.length > 0
            });
        } catch (error) {
            console.error('Error fetching today\'s mood:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to retrieve today\'s mood.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // GET /api/mood/history
    // Get mood history with pagination
    // ------------------------------
    router.get('/history', authenticateToken, async (req, res) => {
        const userId = req.userId;
        const limit = parseInt(req.query.limit) || 30;
        const offset = parseInt(req.query.offset) || 0;

        const queryText = `
            SELECT 
                id,
                mood_rating,
                check_in_date,
                notes,
                created_at
            FROM mood_entries
            WHERE user_id = $1
            ORDER BY check_in_date DESC
            LIMIT $2 OFFSET $3
        `;

        try {
            const result = await pool.query(queryText, [userId, limit, offset]);
            const countResult = await pool.query(
                'SELECT COUNT(*) as total FROM mood_entries WHERE user_id = $1',
                [userId]
            );

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].total),
                    limit,
                    offset,
                    hasMore: offset + result.rows.length < parseInt(countResult.rows[0].total)
                }
            });
        } catch (error) {
            console.error('Error fetching mood history:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to retrieve mood history.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // POST /api/mood/entry
    // Create or update mood entry (one per day)
    // ------------------------------
    router.post('/entry', authenticateToken, async (req, res) => {
        const userId = req.userId;
        const { mood_rating, check_in_date, notes } = req.body;

        // Validate mood rating
        if (!mood_rating || mood_rating < 1 || mood_rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mood rating must be between 1 and 5' 
            });
        }

        const date = check_in_date || new Date().toISOString().split('T')[0];

        try {
            // Check whether user already has an entry for this date
            const existing = await pool.query(
                `SELECT id FROM mood_entries WHERE user_id = $1 AND check_in_date = $2`,
                [userId, date]
            );

            if (existing.rows.length > 0) {
                // Entry already exists: block creation and instruct client to use update endpoint
                return res.status(409).json({
                    success: false,
                    message: 'A mood entry for this date already exists. You can update it via PUT /api/mood/entry/:date.',
                    alreadyExists: true
                });
            }

            // Insert new entry (do not upsert) to enforce one-per-day creation rule
            const insertQuery = `
                INSERT INTO mood_entries (user_id, mood_rating, check_in_date, notes, created_at)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *
            `;

            const result = await pool.query(insertQuery, [userId, mood_rating, date, notes || null]);
            res.status(201).json({
                success: true,
                message: 'Mood entry saved successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Error saving mood entry:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to save mood entry.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // PUT /api/mood/entry/:date
    // Update mood entry for a specific date
    // ------------------------------
    router.put('/entry/:date', authenticateToken, async (req, res) => {
        const userId = req.userId;
        const { date } = req.params;
        const { mood_rating, notes } = req.body;

        if (!mood_rating || mood_rating < 1 || mood_rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mood rating must be between 1 and 5' 
            });
        }

        const queryText = `
            UPDATE mood_entries
            SET mood_rating = $1, notes = $2, created_at = NOW()
            WHERE user_id = $3 AND check_in_date = $4
            RETURNING *
        `;

        try {
            const result = await pool.query(queryText, [mood_rating, notes, userId, date]);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Mood entry not found for this date' 
                });
            }

            res.json({
                success: true,
                message: 'Mood entry updated successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Error updating mood entry:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update mood entry.',
                error: error.message 
            });
        }
    });

    // ------------------------------
    // DELETE /api/mood/entry/:date
    // Delete mood entry for a specific date
    // ------------------------------
    router.delete('/entry/:date', authenticateToken, async (req, res) => {
        const userId = req.userId;
        const { date } = req.params;

        const queryText = `
            DELETE FROM mood_entries
            WHERE user_id = $1 AND check_in_date = $2
            RETURNING *
        `;

        try {
            const result = await pool.query(queryText, [userId, date]);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Mood entry not found for this date' 
                });
            }

            res.json({
                success: true,
                message: 'Mood entry deleted successfully',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('Error deleting mood entry:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete mood entry.',
                error: error.message 
            });
        }
    });

    return router;
};

export default moodRoutes;