import express from 'express';
import User from '../models/User.js'; // Changed require() to import and added .js extension

const router = express.Router();

// Update user profile
router.put('/:userId', async (req, res) => {
  const { username, avatarUrl } = req.body;
  
  if (!username && !avatarUrl) {
    return res.status(400).json({ message: 'No fields provided for update.' });
  }

  try {
    const updated = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { username, avatarUrl, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error while updating user.' });
  }
});

export default router; // Changed module.exports to export default