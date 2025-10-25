import { Request, Response } from 'express';
import { Message } from '../models/message';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || 'default_key_32_chars_long!'; // 32 chars for aes-256
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const createMessage = async (req: Request, res: Response) => {
  try {
    const encryptedContent = encrypt(req.body.content);
    const message = new Message({ ...req.body, content: encryptedContent, encrypted: true });
    await message.save();
    // TODO: Publish to Ably here
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    const content = message.encrypted ? decrypt(message.content) : message.content;
    res.json({ ...message.toObject(), content });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getAllMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    const decrypted = messages.map(msg => ({ ...msg.toObject(), content: msg.encrypted ? decrypt(msg.content) : msg.content }));
    res.json(decrypted);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
