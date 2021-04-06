"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    user1: {
        type: String,
        default: '',
    },
    user2: {
        type: String,
        default: '',
    },
});
const roomModel = mongoose_1.default.model('room', roomSchema);
exports.default = roomModel;
