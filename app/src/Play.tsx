import React, { useMemo, useState } from 'react';
import { ChessBoard } from './ChessBoard';

interface toPlay {
	side: 'White' | 'Black' | null;
	socketRef: React.MutableRefObject<WebSocket | null>;
	roomCode: string;
	move: string | null;
}

interface query {
	type: 'Create' | 'Join' | 'Play' | 'Error' | 'Move';
	time?: string;
	code?: string;
	message?: string;
	username?: string;
}

export const Play: (props: toPlay) => JSX.Element | null = ({ move, roomCode, side, socketRef }) => {
	const [turn, setTurn] = useState<'White' | 'Black' | null>(side);

	const board = useMemo(() => {
		console.log('running memo');
		if (move) {
			let mv = JSON.parse(move);
			console.log(mv.board);
			return mv.board;
		} else return null;
	}, [move]);

	if (!side) return null;

	const makeMove = async (board: Array<Array<string>>) => {
		if (socketRef.current) {
			const socket = socketRef.current;
			let q: query = {
				type: 'Move',
				message: JSON.stringify({ roomCode, side, board }),
			};
			socket.send(JSON.stringify(q));
		}
	};

	console.log('play');
	return (
		<>
			<h1>Playing as {side}</h1>
			<ChessBoard move={board} makeMove={makeMove} side={turn}></ChessBoard>
		</>
	);
};
