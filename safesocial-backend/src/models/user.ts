import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  walletAddress: string;
  friends?: string[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

export const User = model<IUser>('User', userSchema);
