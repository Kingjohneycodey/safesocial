import { Schema, model, Document, Types } from 'mongoose';
import Ably from 'ably';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  content: string;
  encrypted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  encrypted: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Message = model<IMessage>('Message', messageSchema);

const ably = new Ably.Rest(process.env.ABLY_API_KEY || '');

export const publishMessageToAbly = (message: IMessage) => {
  const channel = ably.channels.get(`messages:${message.recipient.toString()}`);
  channel.publish('new-message', {
    sender: message.sender,
    recipient: message.recipient,
    content: message.content,
    encrypted: message.encrypted,
    createdAt: message.createdAt,
    _id: message._id,
  });
};
