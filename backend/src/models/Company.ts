import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICompany extends Document {
  userId: Types.ObjectId;
  companyName: string;
  role: string; // job role applied for
  applicationDate: Date;
  status: 'Applied' | 'Online Assessment' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';
  companyLink?: string;
  techStacks?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    companyLink: {
      type: String,
      trim: true,
    },
    techStacks: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CompanySchema.index({ userId: 1, companyName: 1 });
CompanySchema.index({ userId: 1, status: 1 });
CompanySchema.index({ applicationDate: -1 });

export default mongoose.model<ICompany>('Company', CompanySchema);
