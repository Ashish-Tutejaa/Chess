"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = 5000;
//uuid
const uuid_1 = require("uuid");
//db init
require("./models");
const room_1 = __importDefault(require("./models/room"));
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ host: 'localhost', port: 8080 });
wss.on('connection', function (socket, request) {
    console.log('connected...');
    socket.uid = uuid_1.v4();
    socket.on('close', async function () {
        console.log('disconnected...');
    });
    socket.on('message', async function (message) {
        console.log('message recieved');
        try {
            const query = JSON.parse(message);
            if (query.type === 'Create') {
                let rid = 1000 + Math.floor(Math.random() * 8999);
                let tempRoom = new room_1.default({ rid, time: query.time, user1: socket.uid, side: query.message });
                await tempRoom.save();
                let resp = {
                    type: 'Create',
                    message: rid.toString(),
                };
                socket.send(JSON.stringify(resp));
            }
            else if (query.type === 'Join') {
                const rooms = await room_1.default.find({ rid: query.code });
                if (rooms) {
                    console.log(rooms);
                    let resp = {
                        type: 'Join',
                        message: 'true',
                    };
                    let [room] = rooms;
                    if (room.user2.length > 0) {
                        resp.type = 'Error';
                        resp.message = 'Room Full';
                        socket.send(JSON.stringify(resp));
                    }
                    else {
                        room.user2 = socket.uid;
                        await room.save();
                        console.log(wss.clients);
                        wss.clients.forEach(val => {
                            console.log(val.uid);
                            let start = {
                                type: 'Play',
                                message: 'Begin',
                            };
                            if (val.uid === room.user1)
                                start.message = room.side;
                            else
                                start.message = room.side === 'Black' ? 'White' : 'Black';
                            val.send(JSON.stringify(start));
                        });
                    }
                }
                else {
                    let resp = {
                        type: 'Error',
                        message: 'Invalid Code',
                    };
                    socket.send(JSON.stringify(resp));
                }
            }
            else if (query.type === 'Move') {
                //socket.id -> find send message to other user.
                if (!query.message)
                    throw 'No Message Recieved';
                let message = JSON.parse(query.message);
                let [room] = await room_1.default.find({ rid: message.roomCode });
                console.log(message, room, socket.uid, room.user1, room.user2);
                let sendTo = room.user1;
                if (room.user1 === socket.uid)
                    sendTo = room.user2;
                console.log('sending to:', sendTo);
                let start = {
                    type: 'Move',
                    message: query.message,
                };
                wss.clients.forEach(socket => {
                    console.log(socket.uid);
                    if (socket.uid === sendTo) {
                        socket.send(JSON.stringify(start));
                    }
                });
            }
        }
        catch (err) {
            let resp = {
                type: 'Error',
                message: 'An Error Occurred',
            };
            socket.send(JSON.stringify(resp));
        }
    });
});
//middleware
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware_1 = require("./middleware");
//routers
const auth_1 = __importDefault(require("./auth"));
app.use(middleware_1.CORS);
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('hi');
});
app.listen(PORT, () => {
    console.log(`server running @ ${PORT}`);
});
