import express from 'express';
import Announcement from '../models/Announcement.js'; // Use import and .js extension

const router = express.Router();

// Get upcoming announcements
router.get('/', async (req, res) => {
  const today = new Date();
  try {
    // Fetch announcements where date is greater than or equal to today, sorted by date
    const upcoming = await Announcement.find({ date: { $gte: today } }).sort('date');
    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

// Add a new announcement
router.post('/', async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const newAnnouncement = new Announcement({ title, description, date });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(400).json({ message: 'Failed to add announcement. Invalid data.' });
  }
});

export default router; // Change module.exports to export default