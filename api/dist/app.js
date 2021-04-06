"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = 5000;
//sockets
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ host: 'localhost', port: 8080 });
wss.on('connection', function (socket, request) {
    console.log(socket);
    socket.on('message', function (message) {
        console.log(message);
    });
});
//db init
require("./models");
//middleware
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware_1 = require("./middleware");
//routers
const rooms_1 = __importDefault(require("./rooms"));
const auth_1 = __importDefault(require("./auth"));
app.use(middleware_1.CORS);
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use('/api/rooms', rooms_1.default);
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('hi');
});
app.listen(PORT, () => {
    console.log(`server running @ ${PORT}`);
});
