import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from './Auth';
import { Play } from './Play';
import { StyledButton, StyledLoader } from './shared/Styles';
import { StyledRetry } from './shared/Components';
import Alert from './Alert';

const StyledLoader1 = styled(StyledLoader)`
	color: white;
	font-size: 3rem;
`;

const StyledButton1 = styled(StyledButton)`
	width: 100px;
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
`;

const JoinController = () => {
	const [err, setErr] = useState<null | { timer: number; title: string }>(null);
	const [status, setStatus] = useState<{ page: number }>({ page: -1 });
	const [retry, setRetry] = useState<number>(0);
	const [code, setCode] = useState<string>('');
	const [side, setSide] = useState<'White' | 'Black' | null>(null);
	const [time, setTime] = useState<number>(-1);
	const socketRef = useRef<null | WebSocket>(null);
	const [move, setMove] = useState<string | null>(null);
	const user = useContext(UserContext);

	useEffect(() => {
		setStatus({ page: -1 });
		const socket = new WebSocket('ws://localhost:8080');

		socket.onopen = () => {
			setStatus({ page: 0 });
		};

		socket.onclose = () => {
			setStatus({ page: -2 });
			setCode('');
			setMove(null);
		};

		socket.onmessage = message => {
			console.log(message.data);
			const resp: query = JSON.parse(message.data);
			console.log(resp);
			if (resp.type === 'Join') {
			} else if (resp.type === 'Play') {
				if (!resp.message) return;

				let respbody = JSON.parse(resp.message);
				if (['Black', 'White', null].includes(respbody.side)) {
					setSide(respbody.side);
					setTime(parseInt(respbody.time));
				}
				setStatus({ page: 1 });
			} else if (resp.type === 'Error') {
				if (resp.message?.includes('disconnected')) {
					console.log(resp);
					setErr({ timer: 5, title: 'Opponent Disconnected' });
					setStatus({ page: 0 });
					setCode('');
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
			if (socket.readyState < 2) socket.close(1000, 'Join unmounted');
		};
	}, [retry]);

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

	let ToRender: (() => JSX.Element) | null = null;

	if (status.page === -2) {
		ToRender = () => <StyledRetry retry={setRetry} />;
	} else if (status.page === -1) {
		ToRender = () => <StyledLoader1 />;
	} else if (status.page === 0) {
		ToRender = () => (
			<React.Fragment>
				<h1>Enter Game Code</h1>
				<input value={code} onChange={e => setCode(e.target.value)} type="text" placeholder="code" />
				<StyledButton1 onClick={joinRoom}>Join Game</StyledButton1>
			</React.Fragment>
		);
	} else if (status.page === 1) {
		ToRender = () => <Play time={time} move={move} roomCode={code} socketRef={socketRef} side={side} />;
	}

	return (
		<StyledWrapper>
			<Alert options={err} />
			{ToRender ? ToRender() : null}
		</StyledWrapper>
	);
};

export default JoinController;
