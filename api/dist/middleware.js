"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS = void 0;
const CORS = (req, res, next) => {
    res.set('Access-Control-Allow-Headers', 'Cookie, Content-Type');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    res.set('Access-Control-Allow-Origin', req.get('Origin'));
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
};
exports.CORS = CORS;
