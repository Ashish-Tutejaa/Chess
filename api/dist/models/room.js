"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    rid: {
        type: String,
        required: true,
    },
    user1: {
        type: String,
        default: '',
    },
    user2: {
        type: String,
        default: '',
    },
    time: {
        type: String,
        required: true,
    },
    side: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 60 * 60 * 60,
        default: Date.now,
    },
});
const roomModel = mongoose_1.default.model('room', roomSchema);
exports.default = roomModel;
