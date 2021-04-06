"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//router
const authRouter = express_1.default.Router();
//db
const user_1 = __importDefault(require("./models/user"));
authRouter.get('/get-user', async (req, res, next) => {
    try {
        let user = req.cookies['uid'];
        if (!user)
            res.status(400).json({ err: 'No token found' });
        else {
            let resp = await user_1.default.findOne({ username: user });
            res.status(200).json({ resp });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});
authRouter.post('/is-valid', async (req, res, next) => {
    try {
        console.log(req.body);
        let user = req.body.username;
        console.log(user);
        if (!user)
            res.status(400).json({ err: 'No username found' });
        else {
            let resp = await user_1.default.findOne({ username: user });
            res.status(200);
            if (resp)
                res.json({ found: true });
            else
                res.json({ found: false });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});
authRouter.post('/make-user', async (req, res, next) => {
    try {
        let username = req.body.username;
        let tempUser = new user_1.default({ username });
        await tempUser.save();
        res.cookie('uid', username, {
            httpOnly: true,
            path: '/',
            maxAge: 1 * 60 * 60 * 1000,
        });
        res.status(200).json({ op: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: 'An internal server error Occurred.  Please try again later.' });
    }
});
exports.default = authRouter;
