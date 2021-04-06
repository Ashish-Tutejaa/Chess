import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from './Auth';

interface toGameController {
	username: string;
}

const StyledWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	& input {
		width: 400px;
	}
`;

const GameController = () => {
	console.log('GAME CONTROLLER');
	const [status, setStatus] = useState<number>(0);
	const [time, setTime] = useState<number>(1);
	const socketRef = useRef<null | WebSocket>(null);
	const user = useContext(UserContext);

	useEffect(() => {
		const socket = new WebSocket('ws://localhost:8080');
		socketRef.current = socket;
		console.log(socket);
		return () => {
			console.log(socketRef.current);
			if (socket.readyState < 2) socket.close(1000, 'component unmounted');
		};
	}, []);

	const makeRoom = () => {
		if (socketRef.current) {
			const socket = socketRef.current;
			socket.send(
				JSON.stringify({
					type: 'Create',
					time: time,
					username: user.username,
				})
			);
		}
	};

	return (
		<StyledWrapper>
			<h1>Play</h1>
			<label htmlFor="time">Minutes per side</label>
			<input value={time} onChange={e => setTime(parseInt(e.target.value))} name="time" type="range" min="1" max="45" />
			<h3>{time}</h3>
			<button onClick={makeRoom}></button>
		</StyledWrapper>
	);
};

export default GameController;
