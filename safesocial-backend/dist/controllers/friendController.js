"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriends = exports.addFriend = void 0;
const user_1 = require("../models/user");
const addFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) {
        return res.status(400).json({ error: 'Missing userId or friendId' });
    }
    try {
        const user = await user_1.User.findById(userId);
        const friend = await user_1.User.findById(friendId);
        if (!user || !friend)
            return res.status(404).json({ error: 'User not found' });
        if (!user.friends)
            user.friends = [];
        if (!user.friends.includes(friendId))
            user.friends.push(friendId);
        await user.save();
        res.json({ success: true, friends: user.friends });
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.addFriend = addFriend;
const getFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await user_1.User.findById(userId).populate('friends');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ friends: user.friends });
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
};
exports.getFriends = getFriends;
