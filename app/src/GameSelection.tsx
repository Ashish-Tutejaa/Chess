import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from './Auth';

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

const Toss = (): string => {
	return Math.floor(Math.random() * 10) % 2 === 0 ? 'Black' : 'White';
};

const StyledController = styled('div')`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	background: ${props => props.theme.colors.bgDARK};
	padding: 30px;
	border-radius: 5px;
	color: white;
	width: 300px;
	font-family: ${props => props.theme.font.main};
	input {
		width: 290px;
	}
	& h2 {
		margin-top: 0px;
		margin-bottom: 60px;
	}
	& > div {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 35px;
		margin-top: 10px;
	}
	button,
	select {
		cursor: pointer;
		height: 100%;
		width: 110px;
		padding: 2px 10px;
		outline: none;
		border: 0px;
		border-radius: 3px;
		background: #181818;
		color: white;
		box-shadow: 0px 0px 0px 1px ${props => props.theme.colors.fgLIGHT};
		font-size: 1rem;
	}

	@media (max-width: 400px) {
		& {
			width: 295px;
			padding: 5px;
		}
	}
`;

export const GameSelection: (props: { socketRef: React.MutableRefObject<WebSocket | null> }) => JSX.Element = ({ socketRef }) => {
	const [time, setTime] = useState<number>(1);
	const [side, setSide] = useState<string>('Random');
	const user = useContext(UserContext);

	const makeRoom = () => {
		if (socketRef.current) {
			const socket = socketRef.current;
			let q: query = {
				type: 'Create',
				time: time.toString(),
				username: user.username,
				message: side === 'Random' ? Toss() : side,
			};
			socket.send(JSON.stringify(q));
		}
	};

	console.log('Game Selection');

	let labels: { [props: string]: number } = { Bullet: 2, Blitz: 7, Rapid: 24, Classical: 45 };
	let label = Object.keys(labels).reduce((acc: string, cur: string): string => {
		if (acc === '' && time <= labels[cur]) return cur;
		return acc;
	}, '');

	return (
		<StyledController>
			<h2>{label}</h2>
			<input value={time} onChange={e => setTime(parseInt(e.target.value))} name="time" type="range" min="1" max="45" />
			<h3>
				{time} Minute{time > 1 ? 's' : ''}
			</h3>
			<div>
				<select value={side} onChange={e => setSide(e.target.value)}>
					<option>Black</option>
					<option>Random</option>
					<option>White</option>
				</select>
				<button onClick={makeRoom}>Start</button>
			</div>
		</StyledController>
	);
};
