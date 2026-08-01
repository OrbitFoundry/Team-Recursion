import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IResource extends Document {
  userId: Types.ObjectId;
  title: string;
  category: 'DSA' | 'Aptitude' | 'Resume' | 'Interview Experience' | 'Core Subjects';
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'],
      required: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ResourceSchema.index({ userId: 1, category: 1 });

export default mongoose.model<IResource>('Resource', ResourceSchema);
