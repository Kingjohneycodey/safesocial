"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.post('/', messageController_1.createMessage);
router.get('/:id', messageController_1.getMessage);
router.get('/', messageController_1.getAllMessages);
exports.default = router;
