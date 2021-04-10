import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from './Auth';
import { Play } from './Play';

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

const StyledWrapper = styled.div`
	width: fit-content;
	height: fit-content;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	color: white;
	font-family: ${props => props.theme.font.main};
	input {
		width: 200px;
		padding: 3px;
		text-align: center;
		font-size: 1rem;
		border-radius: 3px;
		outline: none;
		border: 0px;
		margin-top: 45px;
		margin-bottom: 15px;
	}

	h1 {
		margin: 0px;
	}

	button {
		padding: 5px;
		font-size: 1rem;
		outline: none;
		border: 0px;
		color: white;
		border-radius: 3px;
		box-shadow: 0px 0px 0px 1px ${props => props.theme.colors.fgLIGHT};
		background: #202020;
	}
`;

const JoinController = () => {
	const [status, setStatus] = useState<number>(0);
	const [code, setCode] = useState<string>('');
	const [side, setSide] = useState<'White' | 'Black' | null>(null);
	const socketRef = useRef<null | WebSocket>(null);
	const [move, setMove] = useState<string | null>(null);
	const user = useContext(UserContext);

	useEffect(() => {
		const socket = new WebSocket('ws://localhost:8080');

		socket.onmessage = message => {
			console.log(message.data);
			const resp: query = JSON.parse(message.data);
			console.log(resp);
			if (resp.type === 'Join') {
			} else if (resp.type === 'Play') {
				alert(resp.message);
				if (resp.message && ['Black', 'White', null].includes(resp.message)) {
					setSide(resp.message as any);
				}
				setStatus(1);
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
			if (socket.readyState < 2) socket.close(1000, 'Join unmounted');
		};
	}, []);

	const joinRoom = () => {
		if (socketRef.current) {
			const socket = socketRef.current;
			let q: query = {
				type: 'Join',
				code: code,
				username: user.username,
			};
			socket.send(JSON.stringify(q));
		}
	};

	return (
		<>
			{status === 0 ? (
				<StyledWrapper>
					<h1>Enter Game Code</h1>
					<input value={code} onChange={e => setCode(e.target.value)} type="text" placeholder="code" />
					<button onClick={joinRoom}>Join Game</button>
				</StyledWrapper>
			) : (
				<StyledWrapper>
					<Play move={move} roomCode={code} socketRef={socketRef} side={side} />
				</StyledWrapper>
			)}
		</>
	);
};

export default JoinController;
