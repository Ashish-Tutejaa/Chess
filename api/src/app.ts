import express, { Request, Response, Application, NextFunction } from 'express';
const app: Application = express();
const PORT = 5000;

//env
require('dotenv').config();

//uuid
import { v4 as uuid } from 'uuid';

//db init
import './models';
import roomModel from './models/room';

//sockets
interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

import WebSocket from 'ws';

import http from 'http';
const server = http.createServer(app);

const wss = new WebSocket.Server({ host: 'localhost', port: 8080 });

wss.on('connection', function (socket: WebSocket & { uid: string }, request) {
	console.log('connected...');

	socket.uid = uuid();

	socket.on('close', async function () {
		console.log('disconnected...', socket.uid);
		try {
			let room = await Promise.all([roomModel.find({ user1: socket.uid }), roomModel.find({ user2: socket.uid })]);
			console.log(room);
			let targetID: string | null = null,
				roomID: string | null = null;
			if (room[0][0]) {
				//user1 disconnected send message to user2
				targetID = room[0][0].user2;
				roomID = room[0][0].rid;
			} else if (room[1][0]) {
				//user2 disconnected send message to user1
				targetID = room[1][0].user1;
				roomID = room[1][0].rid;
			}

			if (targetID === null || targetID === '' || roomID === '' || roomID === null) return;
			//room actually exists so tell client and delete room here

			await roomModel.findOneAndDelete({ rid: roomID });

			wss.clients.forEach(client => {
				let start: query = {
					type: 'Error',
					message: 'Player 2 disconnected',
				};
				if ((client as any).uid === targetID) {
					client.send(JSON.stringify(start));
				}
			});
		} catch (err) {
			let resp: query = {
				type: 'Error',
				message: 'An Error Occurred',
			};
			socket.send(JSON.stringify(resp));
		}
	});
	socket.on('message', async function (message) {
		console.log('message recieved');
		try {
			const query: query = JSON.parse(message as string);
			if (query.type === 'Create') {
				let rid = 1000 + Math.floor(Math.random() * 8999);
				let tempRoom = new roomModel({ rid, time: query.time, user1: socket.uid, side: query.message });
				await tempRoom.save();
				let resp: query = {
					type: 'Create',
					message: rid.toString(),
				};
				socket.send(JSON.stringify(resp));
			} else if (query.type === 'Join') {
				const rooms = await roomModel.find({ rid: query.code });
				if (rooms) {
					console.log(rooms);
					let resp: query = {
						type: 'Join',
						message: 'true',
					};
					let [room] = rooms;
					if (room.user2.length > 0) {
						resp.type = 'Error';
						resp.message = 'Room Full';
						socket.send(JSON.stringify(resp));
					} else {
						room.user2 = socket.uid;
						await room.save();
						console.log(wss.clients);
						wss.clients.forEach(val => {
							console.log((val as any).uid);
							let start: query = {
								type: 'Play',
								message: 'Begin',
							};
							if ((val as any).uid === room.user1) start.message = JSON.stringify({ time: room.time, side: room.side });
							else start.message = JSON.stringify({ time: room.time, side: room.side === 'Black' ? 'White' : 'Black' });
							val.send(JSON.stringify(start));
						});
					}
				} else {
					let resp: query = {
						type: 'Error',
						message: 'Invalid Code',
					};
					socket.send(JSON.stringify(resp));
				}
			} else if (query.type === 'Move') {
				//socket.id -> find send message to other user.
				if (!query.message) throw 'No Message Recieved';
				let message = JSON.parse(query.message);
				let [room] = await roomModel.find({ rid: message.roomCode });
				console.log(message, room, socket.uid, room.user1, room.user2);
				let sendTo = room.user1;
				if (room.user1 === socket.uid) sendTo = room.user2;
				console.log('sending to:', sendTo);

				let start: query = {
					type: 'Move',
					message: query.message,
				};

				wss.clients.forEach(socket => {
					console.log((socket as any).uid);
					if ((socket as any).uid === sendTo) {
						socket.send(JSON.stringify(start));
					}
				});
			}
		} catch (err) {
			let resp: query = {
				type: 'Error',
				message: 'An Error Occurred',
			};
			socket.send(JSON.stringify(resp));
		}
	});
});

//middleware
import cookieParser from 'cookie-parser';
import { CORS } from './middleware';

//routers
import authRouter from './auth';

app.use(CORS);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
	console.log(`server running @ ${PORT}`);
});
