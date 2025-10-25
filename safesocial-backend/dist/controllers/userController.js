"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserName = exports.checkNameExists = exports.getAllUsers = exports.getUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const createUser = async (req, res) => {
    try {
        const user = new user_1.User(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.createUser = createUser;
const getUser = async (req, res) => {
    try {
        const user = await user_1.User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.getUser = getUser;
const getAllUsers = async (_req, res) => {
    try {
        const users = await user_1.User.find();
        res.json(users);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.getAllUsers = getAllUsers;
const checkNameExists = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: 'Name is required' });
        const user = await user_1.User.findOne({ name });
        res.json({ exists: !!user });
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.checkNameExists = checkNameExists;
const updateUserName = async (req, res) => {
    try {
        const { walletAddress, name } = req.body;
        if (!walletAddress || !name)
            return res.status(400).json({ error: 'walletAddress and name are required' });
        const user = await user_1.User.findOneAndUpdate({ walletAddress }, { name }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.updateUserName = updateUserName;
