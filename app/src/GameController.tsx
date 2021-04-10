import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from './Auth';
import { GameSelection } from './GameSelection';
import { Lobby } from './Lobby';
import { Play } from './Play';

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
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
	const [gameId, setGameId] = useState<string>('');
	const [side, setSide] = useState<'White' | 'Black' | null>(null);
	const socketRef = useRef<null | WebSocket>(null);
	const [move, setMove] = useState<string | null>(null);

	useEffect(() => {
		const socket = new WebSocket('ws://localhost:8080');

		socket.onclose = () => {};

		socket.onmessage = message => {
			console.log(message.data);
			const resp: query = JSON.parse(message.data);
			console.log(resp);
			if (resp.type === 'Create') {
				setStatus(1);
				setGameId(resp.message as string);
			} else if (resp.type === 'Play') {
				alert(resp.message);
				if (resp.message && ['Black', 'White', null].includes(resp.message)) {
					setSide(resp.message as any);
				}
				setStatus(2);
			} else if (resp.type === 'Error') {
			} else if (resp.type === 'Move') {
				console.log('move made', resp.message);
				if (resp.message) {
					setMove(resp.message);
				}
			}
		};

		socketRef.current = socket;
		console.log(socket);
		return () => {
			console.log(socketRef.current);
			if (socket.readyState < 2) socket.close(1000, 'component unmounted');
		};
	}, []);

	let ToRender: (() => JSX.Element) | null = null;

	if (status === 0) {
		ToRender = () => <GameSelection socketRef={socketRef} />;
	} else if (status === 1) {
		ToRender = () => <Lobby gameId={gameId} />;
	} else {
		ToRender = () => <Play move={move} roomCode={gameId} socketRef={socketRef} side={side} />;
	}

	return <StyledWrapper>{ToRender()}</StyledWrapper>;
};

export default GameController;
