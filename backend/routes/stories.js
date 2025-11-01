import express from 'express';
import Story from '../models/Story.js'; 
import User from '../models/User.js'; // Re-added the import for better model registration

const router = express.Router();
const FLAGS_TO_DELETE = 5; // Define the deletion threshold

// GET all stories (excluding flagged) and use POPULATE for user details
router.get('/', async (req, res) => {
    try {
        // Only fetch stories where flags are less than 5
        const stories = await Story.find({ flags: { $lt: FLAGS_TO_DELETE } })
            .sort('-createdAt')
            .populate('userId', 'username avatarUrl') 
            .populate('comments.userId', 'username avatarUrl') 
            .exec(); 

        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Failed to fetch stories.' });
    }
});

// Post a new story (unchanged)
router.post('/', async (req, res) => {
    const { userId, content } = req.body;
    try {
        const story = new Story({ userId, content });
        await story.save();
        
        const populatedStory = await Story.findById(story._id)
            .populate('userId', 'username avatarUrl');
            
        res.status(201).json(populatedStory);
    } catch (error) {
        console.error('Error posting story:', error);
        res.status(400).json({ message: 'Invalid story data.' });
    }
});

// Like a story (unchanged)
router.post('/:id/like', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json(story);
    } catch (error) {
        console.error('Error liking story:', error);
        res.status(500).json({ message: 'Failed to like story.' });
    }
});

// Comment on a story (unchanged)
router.post('/:id/comment', async (req, res) => {
    const { userId, content } = req.body;
    const storyId = req.params.id;

    try {
        const updatedStory = await Story.findByIdAndUpdate(
            storyId,
            { $push: { comments: { userId, content, createdAt: new Date() } } },
            { new: true } 
        );

        if (!updatedStory) {
            return res.status(404).json({ message: 'Story not found.' });
        }
        
        const fullyPopulatedStory = await Story.findById(storyId)
            .populate('userId', 'username avatarUrl')
            .populate('comments.userId', 'username avatarUrl');
        
        res.status(200).json(fullyPopulatedStory); 
    } catch (error) {
        console.error('Error commenting on story:', error); 
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid comment data.' });
        }
        res.status(500).json({ message: 'Failed to add comment due to server error.' });
    }
});

// --- UPDATED: Flag a story with 5-flag deletion logic ---
router.post('/:id/flag', async (req, res) => {
    try {
        // 1. Increment the flag count and get the updated document
        const story = await Story.findByIdAndUpdate(
            req.params.id, 
            { $inc: { flags: 1 } }, 
            { new: true, fields: 'flags' } // Only retrieve the updated 'flags' count for efficiency
        );

        if (!story) {
            return res.status(404).json({ message: 'Story not found.' });
        }
        
        const currentFlags = story.flags;

        // 2. Check if the deletion threshold is reached
        if (currentFlags >= FLAGS_TO_DELETE) {
            // Delete the story from the database
            await Story.findByIdAndDelete(req.params.id);
            
            // Send a specific response status so the frontend can easily remove the post
            return res.status(200).json({ 
                status: 'deleted', 
                message: `Story deleted after reaching ${FLAGS_TO_DELETE} flags.` 
            });
        }
        
        // 3. If not deleted, confirm the flag was recorded
        res.status(200).json({ 
            status: 'flagged', 
            flags: currentFlags,
            message: `Story flagged. Current count: ${currentFlags}/${FLAGS_TO_DELETE}` 
        });

    } catch (error) {
        console.error('Error flagging story:', error);
        res.status(500).json({ message: 'Failed to flag story.' });
    }
});
// --- END UPDATED Flag logic ---

// Get latest contributors (unchanged)
router.get('/contributors/latest', async (req, res) => {
    try {
        const uniqueUserIds = await Story.distinct('userId', { flags: { $lt: FLAGS_TO_DELETE } })
            .sort({ createdAt: -1 })
            .limit(10);
            
        const top3Ids = uniqueUserIds.slice(0, 3);
        const moreCount = uniqueUserIds.length > 3 ? uniqueUserIds.length - 3 : 0;

        const users = await User.find({ _id: { $in: top3Ids } }, 'avatarUrl');

        const avatars = top3Ids.map(userId => {
            const user = users.find(u => u._id.toString() === userId.toString());
            return {
                userId: userId,
                avatarUrl: user?.avatarUrl
            };
        });

        res.json({ avatars, moreCount });
    } catch (error) {
        console.error('Error fetching contributors:', error);
        res.status(500).json({ message: 'Failed to fetch contributors.' });
    }
});

export default router;