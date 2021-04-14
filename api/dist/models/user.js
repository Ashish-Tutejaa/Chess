"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        expires: 24 * 60 * 60,
        default: Date.now,
    },
});
const userModel = mongoose_1.default.model('chessuser', UserSchema);
exports.default = userModel;
