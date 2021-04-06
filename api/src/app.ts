import express, { Request, Response, Application, NextFunction } from 'express';
const app: Application = express();
const PORT = 5000;

//sockets
import WebSocket from 'ws';

const wss = new WebSocket.Server({ host: 'localhost', port: 8080 });

wss.on('connection', function (socket, request) {
	console.log(socket);
	socket.on('message', function (message) {
		console.log(message);
	});
});

//db init
import './models';

//middleware
import cookieParser from 'cookie-parser';
import { CORS } from './middleware';

//routers
import roomsRouter from './rooms';
import authRouter from './auth';

app.use(CORS);
app.use(express.json());
app.use(cookieParser());

app.use('/api/rooms', roomsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
	res.send('hi');
});

app.listen(PORT, () => {
	console.log(`server running @ ${PORT}`);
});
