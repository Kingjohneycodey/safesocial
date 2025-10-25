"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)('User', userSchema);
