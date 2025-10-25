import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: Types.ObjectId;
  media?: string;
}

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  media: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Post = model<IPost>('Post', postSchema);
