"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessageToAbly = exports.Message = void 0;
const mongoose_1 = require("mongoose");
const ably_1 = __importDefault(require("ably"));
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    encrypted: { type: Boolean, default: true },
}, {
    timestamps: true,
});
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
const ably = new ably_1.default.Rest(process.env.ABLY_API_KEY || '');
const publishMessageToAbly = (message) => {
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
exports.publishMessageToAbly = publishMessageToAbly;
