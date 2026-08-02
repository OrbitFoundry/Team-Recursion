import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role?: string;
  googleId?: string;
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  resumeUrl?: string;
  techStacks?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resumeUrl: String,
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    techStacks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ resetPasswordExpires: 1 });

export default mongoose.model<IUser>('User', UserSchema);

