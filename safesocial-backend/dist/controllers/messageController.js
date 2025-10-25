"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.getMessage = exports.createMessage = void 0;
const message_1 = require("../models/message");
const crypto_1 = __importDefault(require("crypto"));
const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || 'default_key_32_chars_long!'; // 32 chars for aes-256
const IV_LENGTH = 16;
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
const createMessage = async (req, res) => {
    try {
        const encryptedContent = encrypt(req.body.content);
        const message = new message_1.Message({ ...req.body, content: encryptedContent, encrypted: true });
        await message.save();
        // TODO: Publish to Ably here
        res.status(201).json(message);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.createMessage = createMessage;
const getMessage = async (req, res) => {
    try {
        const message = await message_1.Message.findById(req.params.id);
        if (!message)
            return res.status(404).json({ error: 'Message not found' });
        const content = message.encrypted ? decrypt(message.content) : message.content;
        res.json({ ...message.toObject(), content });
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.getMessage = getMessage;
const getAllMessages = async (_req, res) => {
    try {
        const messages = await message_1.Message.find();
        const decrypted = messages.map(msg => ({ ...msg.toObject(), content: msg.encrypted ? decrypt(msg.content) : msg.content }));
        res.json(decrypted);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.getAllMessages = getAllMessages;
