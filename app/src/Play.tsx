import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChessBoardMemo } from './ChessBoard';
import { BsCircle, BsCircleFill } from 'react-icons/bs';

interface toPlay {
	side: 'White' | 'Black' | null;
	socketRef: React.MutableRefObject<WebSocket | null>;
	roomCode: string;
	move: string | null;
	time: number;
}

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

interface toTimer {
	time: number;
	start: boolean;
	// reset: number;
	once: boolean;
}

const Timer: (props: toTimer) => JSX.Element = ({ time: originalTime, start, once }) => {
	const [time, setTime] = useState<number>(originalTime);
	const timeOutRef = useRef<NodeJS.Timeout | null>(null);

	console.log(time);
	useEffect(() => {
		if (once && time <= 0) return;

		if (!start) {
			if (timeOutRef.current) clearTimeout(timeOutRef.current);
			return;
		}
		if (timeOutRef.current !== null) {
			clearTimeout(timeOutRef.current);
			timeOutRef.current = null;
		}

		timeOutRef.current = setTimeout(() => {
			setTime(p => p - 100);
		}, 100);
	});

	return <h3 style={{ color: 'black' }}>{Math.max(0, time)}</h3>;
};

const StyledWrapper = styled('div')`
	height: 100%;
	width: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
	position: relative;
	h1 {
		position: absolute;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
	}
	& > div:last-child {
		height: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 10px 10px;
	}
`;

export const Play: (props: toPlay) => JSX.Element | null = ({ time, move, roomCode, side, socketRef }) => {
	const [turn, _] = useState<'White' | 'Black' | null>(side);
	const [curTurn, setCurTurn] = useState<'W' | 'B'>('W');
	// const [resetBoard, setResetBoard] = useState<boolean>(false);
	// const [start, setStart] = useState<boolean>(false);

	// useEffect(() => {
	// 	if (!start) {
	// 		setTimeout(_ => setStart(true), 10 * 1000);
	// 	}
	// }, []);

	const board = useMemo(() => {
		console.log('running memo');
		if (move) {
			setCurTurn(p => (p === 'W' ? 'B' : 'W'));
			let mv = JSON.parse(move);
			console.log(move);
			console.log(mv.board);
			return mv.board;
		} else return null;
	}, [move]);

	if (!side || !time) return null;

	const makeMove = async (board: Array<Array<string>>) => {
		if (socketRef.current) {
			setCurTurn(p => (p === 'W' ? 'B' : 'W'));
			const socket = socketRef.current;
			let q: query = {
				type: 'Move',
				message: JSON.stringify({ roomCode, side, board }),
			};
			socket.send(JSON.stringify(q));
		}
	};

	return (
		<StyledWrapper>
			<h1>Playing as {side}</h1>
			<ChessBoardMemo move={board} makeMove={makeMove} side={turn}></ChessBoardMemo>
			<div>
				<span>{curTurn === 'W' ? <BsCircle /> : <BsCircleFill />}</span>
				<span>{curTurn === 'W' ? <BsCircleFill /> : <BsCircle />}</span>
			</div>
			{/* <Timer once={true} time={10 * 1000} start={!start} />
			<Timer once={true} time={time * 60 * 1000} start={start && curTurn === 'W'} />
			<Timer once={true} time={time * 60 * 1000} start={start && curTurn === 'B'} /> */}
		</StyledWrapper>
	);
};
