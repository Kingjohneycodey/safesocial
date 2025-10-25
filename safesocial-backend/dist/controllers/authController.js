"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.getNonce = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ethers_1 = require("ethers");
const user_1 = require("../models/user");
// Nonce generation and storage (in-memory for demo; use Redis/DB for production)
const nonces = {};
const getNonce = async (req, res) => {
    const { address } = req.body;
    if (!address)
        return res.status(400).json({ error: 'Missing address' });
    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1e16).toString();
    nonces[address.toLowerCase()] = nonce;
    res.json({ nonce });
};
exports.getNonce = getNonce;
// Example: Replace with actual BlockDAG verification logic
async function verifyBlockDAGSignature(address, signature, message) {
    // Use ethers to recover the address from the signed message
    try {
        const recovered = ethers_1.ethers.verifyMessage(message, signature);
        return recovered.toLowerCase() === address.toLowerCase();
    }
    catch {
        return false;
    }
}
const login = async (req, res) => {
    const { address, signature } = req.body;
    if (!address || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const nonce = nonces[address.toLowerCase()];
    if (!nonce)
        return res.status(400).json({ error: 'Nonce not found. Request a new nonce.' });
    try {
        const isValid = await verifyBlockDAGSignature(address, signature, nonce);
        if (!isValid)
            return res.status(401).json({ error: 'Invalid signature' });
        delete nonces[address.toLowerCase()]; // Prevent replay
        let user = await user_1.User.findOne({ walletAddress: address });
        if (!user) {
            // User does not exist, create and flag for onboarding
            user = new user_1.User({ walletAddress: address });
            await user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id, address, onboarding: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            return res.json({ token, user, onboarding: true });
        }
        // User exists, return token and onboarding false
        const token = jsonwebtoken_1.default.sign({ id: user._id, address, onboarding: false }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user, onboarding: false });
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.login = login;
const me = async (req, res) => {
    res.json(req.user);
};
exports.me = me;
