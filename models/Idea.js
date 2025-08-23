import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
