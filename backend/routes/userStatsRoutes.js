// routes/userStatsRoutes.js
import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';

const userStatsRoutes = (pool) => {
    const router = express.Router();

    // ------------------------------
    // GET /api/user-stats/overview
    // Get comprehensive user statistics
    // ------------------------------
    router.get('/overview', authenticateToken, async (req, res) => {
        const userId = req.userId;

        try {
            // 1. Get user account info and date of first use
            const userQuery = `
                SELECT 
                    id,
                    name,
                    email,
                    created_at as registration_date,
                    avatar_url
                FROM users
                WHERE id = $1
            `;

            // 2. Get mood statistics
            const moodStatsQuery = `
                SELECT 
                    COUNT(*) as total_mood_entries,
                    MIN(check_in_date) as first_mood_entry_date,
                    MAX(check_in_date) as last_mood_entry_date,
                    ROUND(AVG(mood_rating)::numeric, 1) as overall_avg_mood
                FROM mood_entries
                WHERE user_id = $1
            `;

            // 3. Get assessment statistics
            const assessmentStatsQuery = `
                SELECT 
                    COUNT(*) as total_assessments,
                    MIN(taken_at) as first_assessment_date,
                    MAX(taken_at) as last_assessment_date,
                    COUNT(DISTINCT assessment_type) as unique_assessment_types
                FROM assessment_scores
                WHERE user_id = $1
            `;

            // 4. Calculate days since first use (earliest of mood or assessment)
            const firstUseQuery = `
                SELECT 
                    LEAST(
                        COALESCE((SELECT MIN(check_in_date) FROM mood_entries WHERE user_id = $1), CURRENT_DATE),
                        COALESCE((SELECT MIN(taken_at::date) FROM assessment_scores WHERE user_id = $1), CURRENT_DATE)
                    ) as first_use_date
            `;

            // 5. Get current streak from mood entries
            const streakQuery = `
                WITH RECURSIVE date_check AS (
                    SELECT 
                        CURRENT_DATE::date as check_date,
                        CASE WHEN EXISTS (
                            SELECT 1 FROM mood_entries 
                            WHERE user_id = $1 AND check_in_date = CURRENT_DATE
                        ) THEN 1 ELSE 0 END as has_entry
                    
                    UNION ALL
                    
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

            // Execute all queries in parallel
            const [
                userResult,
                moodStatsResult,
                assessmentStatsResult,
                firstUseResult,
                streakResult
            ] = await Promise.all([
                pool.query(userQuery, [userId]),
                pool.query(moodStatsQuery, [userId]),
                pool.query(assessmentStatsQuery, [userId]),
                pool.query(firstUseQuery, [userId]),
                pool.query(streakQuery, [userId])
            ]);

            const user = userResult.rows[0];
            const moodStats = moodStatsResult.rows[0];
            const assessmentStats = assessmentStatsResult.rows[0];
            const firstUse = firstUseResult.rows[0];
            const streak = streakResult.rows[0];

            // Calculate days since first use
            const firstUseDate = firstUse.first_use_date;
            const daysSinceFirstUse = firstUseDate 
                ? Math.floor((new Date() - new Date(firstUseDate)) / (1000 * 60 * 60 * 24))
                : 0;

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        registrationDate: user.registration_date,
                        avatarUrl: user.avatar_url
                    },
                    usage: {
                        firstUseDate: firstUseDate,
                        daysSinceFirstUse: daysSinceFirstUse,
                        registrationDate: user.registration_date
                    },
                    mood: {
                        totalEntries: parseInt(moodStats.total_mood_entries) || 0,
                        firstEntry: moodStats.first_mood_entry_date,
                        lastEntry: moodStats.last_mood_entry_date,
                        overallAverage: parseFloat(moodStats.overall_avg_mood) || 0,
                        currentStreak: parseInt(streak.current_streak) || 0
                    },
                    assessments: {
                        totalCompleted: parseInt(assessmentStats.total_assessments) || 0,
                        firstAssessment: assessmentStats.first_assessment_date,
                        lastAssessment: assessmentStats.last_assessment_date,
                        uniqueTypes: parseInt(assessmentStats.unique_assessment_types) || 0
                    }
                }
            });

        } catch (error) {
            console.error('Error fetching user stats overview:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve user statistics.',
                error: error.message
            });
        }
    });

    // ------------------------------
    // GET /api/user-stats/achievements
    // Get user achievements/milestones
    // ------------------------------
    router.get('/achievements', authenticateToken, async (req, res) => {
        const userId = req.userId;

        try {
            // Get various statistics for achievements
            const achievementsQuery = `
                WITH mood_stats AS (
                    SELECT 
                        COUNT(*) as total_moods,
                        COUNT(DISTINCT check_in_date) as unique_days,
                        MIN(check_in_date) as first_mood
                    FROM mood_entries
                    WHERE user_id = $1
                ),
                assessment_stats AS (
                    SELECT 
                        COUNT(*) as total_assessments,
                        COUNT(DISTINCT assessment_type) as unique_types
                    FROM assessment_scores
                    WHERE user_id = $1
                ),
                streak_calc AS (
                    WITH RECURSIVE date_check AS (
                        SELECT 
                            CURRENT_DATE::date as check_date,
                            CASE WHEN EXISTS (
                                SELECT 1 FROM mood_entries 
                                WHERE user_id = $1 AND check_in_date = CURRENT_DATE
                            ) THEN 1 ELSE 0 END as has_entry
                        
                        UNION ALL
                        
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
                )
                SELECT 
                    ms.total_moods,
                    ms.unique_days,
                    ms.first_mood,
                    ast.total_assessments,
                    ast.unique_types,
                    sc.current_streak
                FROM mood_stats ms
                CROSS JOIN assessment_stats ast
                CROSS JOIN streak_calc sc
            `;

            const result = await pool.query(achievementsQuery, [userId]);
            const stats = result.rows[0];

            // Define achievements based on stats
            const achievements = [];

            // Mood-based achievements
            if (stats.total_moods >= 1) {
                achievements.push({
                    id: 'first_checkin',
                    title: 'First Check-in',
                    description: 'Completed your first mood entry',
                    icon: 'Users',
                    date: stats.first_mood,
                    unlocked: true
                });
            }

            if (stats.total_moods >= 10) {
                achievements.push({
                    id: 'mood_master',
                    title: 'Mood Master',
                    description: 'Logged 10+ mood entries',
                    icon: 'Award',
                    unlocked: true
                });
            }

            if (stats.total_moods >= 50) {
                achievements.push({
                    id: 'mood_expert',
                    title: 'Mood Expert',
                    description: 'Logged 50+ mood entries',
                    icon: 'Award',
                    unlocked: true
                });
            }

            // Streak-based achievements
            if (stats.current_streak >= 7) {
                achievements.push({
                    id: 'week_warrior',
                    title: 'Week Warrior',
                    description: '7-day check-in streak',
                    icon: 'Calendar',
                    unlocked: true
                });
            }

            if (stats.current_streak >= 30) {
                achievements.push({
                    id: 'monthly_master',
                    title: 'Monthly Master',
                    description: '30-day check-in streak',
                    icon: 'Calendar',
                    unlocked: true
                });
            }

            // Assessment-based achievements
            if (stats.total_assessments >= 3) {
                achievements.push({
                    id: 'assessment_starter',
                    title: 'Assessment Starter',
                    description: 'Completed 3 assessments',
                    icon: 'CheckCircle',
                    unlocked: true
                });
            }

            if (stats.unique_types >= 3) {
                achievements.push({
                    id: 'well_rounded',
                    title: 'Well-Rounded',
                    description: 'Completed all 3 assessment types',
                    icon: 'CheckCircle',
                    unlocked: true
                });
            }

            res.json({
                success: true,
                data: {
                    achievements,
                    stats: {
                        totalMoods: parseInt(stats.total_moods) || 0,
                        totalAssessments: parseInt(stats.total_assessments) || 0,
                        currentStreak: parseInt(stats.current_streak) || 0,
                        uniqueDays: parseInt(stats.unique_days) || 0
                    }
                }
            });

        } catch (error) {
            console.error('Error fetching achievements:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve achievements.',
                error: error.message
            });
        }
    });

    return router;
};

export default userStatsRoutes;