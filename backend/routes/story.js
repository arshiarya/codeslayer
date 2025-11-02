import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  flags: { type: Number, default: 0 },
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Use 'export default' instead of 'module.exports'
export default mongoose.model('Story', storySchema);