import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, default: '', maxlength: 1000 },
    dueAt: { type: Date, required: [true, 'Date & time is required'], index: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  },
  { timestamps: true }
);
taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Task', taskSchema);
