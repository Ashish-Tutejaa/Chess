import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { UserContext } from './Auth';
import { GameSelection } from './GameSelection';
import { Lobby } from './Lobby';
import { Play } from './Play';
import { StyledLoader, StyledButton } from './shared/Styles';
import { StyledRetry } from './shared/Components';
import Alert from './Alert';

const StyledLoader1 = styled(StyledLoader)`
	color: white;
	font-size: 3rem;
`;

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

const StyledWrapper = styled.div`
	height: 500px;
	width: 500px;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	color: white;
	font-family: ${props => props.theme.font.main};
	& > input {
		width: 400px;
	}
	h1 {
		margin: 0px;
	}
`;

const GameController = () => {
	console.log('GAME CONTROLLER');
	const [retry, setRetry] = useState<number>(0);
	const [status, setStatus] = useState<{ page: number }>({ page: -1 });
	const [gameId, setGameId] = useState<string>('');
	const [side, setSide] = useState<'White' | 'Black' | null>(null);
	const [time, setTime] = useState<number>(-1);
	const socketRef = useRef<null | WebSocket>(null);
	const [move, setMove] = useState<string | null>(null);
	const [err, setErr] = useState<null | { timer: number; title: string }>(null);

	useEffect(() => {
		setStatus({ page: -1 });
		const socket = new WebSocket('ws://localhost:5000');

		socket.onclose = () => {
			setStatus({ page: -2 });
			setMove(null);
		};

		socket.onopen = () => {
			setStatus({ page: 0 });
		};

		socket.onmessage = message => {
			console.log(message.data);
			const resp: query = JSON.parse(message.data);
			console.log(resp);
			if (resp.type === 'Create') {
				setStatus({ page: 1 });
				setGameId(resp.message as string);
			} else if (resp.type === 'Play') {
				if (!resp.message) return;

				let respbody = JSON.parse(resp.message);
				if (['Black', 'White', null].includes(respbody.side)) {
					setSide(respbody.side);
					setTime(parseInt(respbody.time));
				}
				setStatus({ page: 2 });
			} else if (resp.type === 'Error') {
				console.log(resp);
				if (resp.message?.includes('disconnected')) {
					console.log(resp);
					setErr({ timer: 5, title: 'Opponent Disconnected' });
					setStatus({ page: 0 });
					setMove(null);
				} else if (resp.message) {
					setErr({ timer: 5, title: resp.message });
					setStatus({ page: 0 });
				}
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
	}, [retry]);

	let ToRender: (() => JSX.Element) | null = null;

	if (status.page === -2) {
		ToRender = () => <StyledRetry retry={setRetry} />;
	} else if (status.page === -1) {
		ToRender = () => <StyledLoader1 />;
	} else if (status.page === 0) {
		ToRender = () => <GameSelection socketRef={socketRef} />;
	} else if (status.page === 1) {
		ToRender = () => <Lobby gameId={gameId} />;
	} else {
		ToRender = () => <Play time={time} move={move} roomCode={gameId} socketRef={socketRef} side={side} />;
	}

	return (
		<StyledWrapper>
			<Alert options={err} />
			{ToRender()}
		</StyledWrapper>
	);
};

export default GameController;
