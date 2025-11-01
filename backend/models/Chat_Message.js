import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  avatarUrl: { type: String },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  flags: { type: Number, default: 0 },
  replies: [{
    userId: String,
    avatarUrl: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Use 'export default' for the model
export default mongoose.model('ChatMessage', chatMessageSchema);