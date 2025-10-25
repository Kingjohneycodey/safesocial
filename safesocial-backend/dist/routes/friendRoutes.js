"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendController_1 = require("../controllers/friendController");
const router = (0, express_1.Router)();
router.post('/add', friendController_1.addFriend);
router.get('/:userId', friendController_1.getFriends);
exports.default = router;
