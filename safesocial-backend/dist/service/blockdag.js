"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet = exports.provider = void 0;
const ethers_1 = require("ethers");
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.BLOCKDAG_RPC_URL);
exports.provider = provider;
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
exports.wallet = wallet;
