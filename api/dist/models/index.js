"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
if (process.env.MONGO_URI) {
    mongoose_1.default.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('successfully connected to database');
        }
    });
}
else {
    console.log('No URI found');
}
