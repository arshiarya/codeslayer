import express from 'express';
import ChatMessage from '../models/Chat_Message.js'; // Use import and .js extension

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    // Fetches messages that have been flagged less than 5 times, sorted by newest first
    const messages = await ChatMessage.find({ flags: { $lt: 5 } }).sort('-createdAt');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Failed to retrieve messages.' });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  const { userId, avatarUrl, content } = req.body;
  try {
    const newMessage = new ChatMessage({ userId, avatarUrl, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error posting new message:', error);
    res.status(400).json({ message: 'Invalid message data.' });
  }
});

// Reply to a message
router.post('/:id/reply', async (req, res) => {
  const { userId, avatarUrl, content } = req.body;
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: { userId, avatarUrl, content, createdAt: new Date() } } }, // Add createdAt for replies
      { new: true }
    );
    res.json(message);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply.' });
  }
});

// Like a message
router.post('/:id/like', async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json(message);
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ message: 'Failed to like message.' });
  }
});

// Flag a message
router.post('/:id/flag', async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(req.params.id, { $inc: { flags: 1 } }, { new: true });
    if (message && message.flags >= 5) {
      await ChatMessage.findByIdAndDelete(req.params.id);
      return res.json({ status: 'deleted due to flags' });
    }
    res.json({ status: 'flagged', message });
  } catch (error) {
    console.error('Error flagging message:', error);
    res.status(500).json({ message: 'Failed to flag message.' });
  }
});

export default router; // Change module.exports to export default