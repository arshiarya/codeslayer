import mongoose from 'mongoose'; // Change 'require' to 'import'

const MoodEntrySchema = new mongoose.Schema({
  // Links the entry to the user who created it (ID from the JWT)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference your User model here
    required: true,
  },
  // The mood name selected from the frontend
  mood: {
    type: String,
    required: [true, 'Mood selection is required'],
    enum: ['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious'], // Ensures only valid moods are saved
  },
  // The optional note/reflection from the user
  note: {
    type: String,
    trim: true,
    maxlength: 500, // Good practice to limit text length
  },
  // Automatically records the date/time of the entry
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // 'timestamps: true' adds createdAt and updatedAt fields

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

export default MoodEntry; // Change 'module.exports' to 'export default'