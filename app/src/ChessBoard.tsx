import React, { useContext, useEffect, useRef, useState } from 'react';
import { Pieces, side_finder, piece_loc, make_array, get_mapping, get_mapping_helper, stop_mate } from './moves';
import { useAllRefs } from './useAllRefs';
import { Piece } from './Piece';
import { Td } from './Td';

interface pos {
	childPosY: number;
	childPosX: number;
	loc: string;
}

type newMouseEventOnDiv = React.MouseEvent<HTMLDivElement, MouseEvent> & pos;

const makeBoard = (side: 'White' | 'Black' | null): Array<Array<string>> => {
	const initBoard: Array<Array<string>> = [];
	make_array(8).forEach(ele => {
		initBoard.push(make_array(8));
	});
	for (let i in Pieces) {
		let [x, y] = Pieces[i].cur_coords();
		initBoard[7 - y][x] = Pieces[i].name;
	}

	if (side === 'White' || side === null) return initBoard;
	else {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 4; j++) {
				let t: string = '';
				t = initBoard[j][i];
				initBoard[j][i] = initBoard[7 - j][i];
				initBoard[7 - j][i] = t;
			}
		}
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 4; j++) {
				let t: string = '';
				t = initBoard[i][j];
				initBoard[i][j] = initBoard[i][7 - j];
				initBoard[i][7 - j] = t;
			}
		}
		return initBoard;
	}
};

const check4mate = async (
	name: string,
	board: Array<Array<string>>,
	setBoard: React.Dispatch<React.SetStateAction<string[][]>>,
	setTurn: React.Dispatch<React.SetStateAction<string>>,
	side: 'White' | 'Black' | null
): Promise<boolean> => {
	let before_move = get_mapping_helper(board, name);
	if (before_move) {
		return false;
	}
	let res = stop_mate(side_finder(name), board);
	if (!res) {
		setBoard(makeBoard(side));
		for (let i in Pieces) {
			if (i[0] === 'P') {
				(Pieces[i] as any).first_move = true;
			}
		}
		setTurn('W');
		return true;
	}
	return false;
};

interface toChessBoard {
	makeMove?: (board: Array<Array<string>>) => Promise<void>;
	side: 'White' | 'Black' | null;
	move?: Array<Array<string>> | null;
}

export const ChessBoard: (props: toChessBoard) => JSX.Element = ({ move, side, makeMove }) => {
	console.log('board re-rendered');
	const [board, setBoard] = useState<Array<Array<string>>>(makeBoard(side));
	const [turn, setTurn] = useState<string>('W');
	const Refs = useAllRefs();
	const parentInfoRef = useRef<null | {
		x: number;
		y: number;
		name: string;
		loc: string;
		dropLoc: string[];
	}>(null);
	const clickedRef = useRef<false | true>(false);

	useEffect(() => {
		if (move) {
			setBoard(move);
			setTurn(p => (p === 'W' ? 'B' : 'W'));
		}
	}, [move]);

	useEffect(() => {
		(async () => {
			let check_white = await check4mate('K1', board, setBoard, setTurn, side);
			if (check_white) {
				alert('Checkmate.  Black wins.');
				return;
			}
			let check_black = await check4mate('K2', board, setBoard, setTurn, side);
			if (check_black) {
				alert('Checkmate.  White wins.');
				return;
			}
		})();
	});

	let a = [0, 1, 2, 3, 4, 5, 6, 7];
	return (
		<div
			onMouseDown={(e: newMouseEventOnDiv) => {
				const list = Array.from((e.target as HTMLDivElement).classList);

				if (!list.includes('piece')) return;
				const name = list[1];
				console.log(name, Pieces[name], turn);
				if (Pieces[name].side !== turn) return;
				if (side !== null && side[0] !== turn) {
					console.log('cancelling');
					return;
				}

				const targetRef = Refs[name];
				console.log(targetRef);

				if (targetRef.current !== null) {
					targetRef.current.style.zIndex = '100';
					targetRef.current.style.transform = `translateX(${e.clientX - 15 - e.childPosX}px) translateY(${e.clientY - 15 - e.childPosY}px)`;

					let dropLocations = (Pieces[name] as any).finder(board, Number(e.loc[0]), Number(e.loc[1]), side === null);

					let processed: string[] = dropLocations.reduce((acc: [], cur: number[][], i: number) => {
						return [
							...acc,
							...cur.map((ele: number[]) => {
								return ele.join('');
							}),
						];
					}, []);

					console.log(processed, dropLocations);

					clickedRef.current = true;
					parentInfoRef.current = {
						x: e.childPosX,
						y: e.childPosY,
						loc: e.loc,
						name: Array.from((e.target as HTMLDivElement).classList)[1],
						dropLoc: processed,
					};

					for (let j of processed) {
						let x = document.getElementById(j);
						if (x !== null) {
							x.classList.add('selCol');
						}
					}
				}
			}}
			onMouseUp={e => {
				if (clickedRef.current === false || parentInfoRef.current === null) return;

				const { name, dropLoc, loc } = parentInfoRef.current;
				const targetRef = Refs[name];
				let dropTarget: any = null;
				Array.from(document.elementsFromPoint(e.clientX, e.clientY)).forEach(ele => {
					if (dropTarget !== null) return;
					if (ele.nodeName === 'TD') dropTarget = ele;
				});

				drop_target: {
					if (dropTarget !== null && dropLoc.includes(dropTarget.id)) {
						let x = Number(dropTarget.id[1]);
						let y = Number(dropTarget.id[0]);
						let tboard = JSON.parse(JSON.stringify(board));

						//check if you are in check!
						let before_move = get_mapping_helper(board, name);
						tboard[loc[1]][loc[0]] = '';
						tboard[x][y] = name;
						let after_move = get_mapping_helper(tboard, name);

						if (!before_move && !after_move) {
							alert("you're in check");
							break drop_target;
						}
						if (!after_move) break drop_target;

						//check if you can take king...
						if (board[x][y][0] === 'K') {
							if (board[x][y][1] === '1') alert('White wins');
							else alert('Black wins');
							setBoard(makeBoard(side));
							setTurn('W');
							break drop_target;
						}

						if (name[0] === 'P' && 'first_move' in Pieces[name]) (Pieces[name] as any).first_move = false;
						setBoard(tboard);
						setTurn(p => (p === 'W' ? 'B' : 'W'));
						if (makeMove) makeMove(tboard);
					}
				}

				if (targetRef.current !== null) {
					targetRef.current.style.zIndex = '10';
					targetRef.current.style.transform = ``;
				}

				for (let j of dropLoc) {
					let x = document.getElementById(j);
					if (x !== null) {
						x.classList.remove('selCol');
					}
				}

				clickedRef.current = false;
				parentInfoRef.current = null;
			}}
			onMouseMove={(e: newMouseEventOnDiv) => {
				if (clickedRef.current === false || parentInfoRef.current === null) return;

				const { name: pieceName, loc: pieceLoc, x, y } = parentInfoRef.current;
				const targetRef = Refs[pieceName];

				if (targetRef.current !== null) {
					targetRef.current.style.transform = `translateX(${e.clientX - 15 - x}px) translateY(${e.clientY - 15 - y}px)`;
				}
			}}
			className="board">
			<table>
				<tbody>
					{a.map(i => (
						<tr>
							{a.map(j => {
								let pieceRN = null;
								if (board[i][j] !== '') pieceRN = <Piece pieceInfo={Pieces[board[i][j]]} name={`${board[i][j]}`} thisIsARef={Refs[`${board[i][j]}`]} />;

								return (
									<Td row={j} col={i} piece={i === 0 && j === 0} i={i % 2 === 1} j={j % 2 === 0}>
										{pieceRN}
									</Td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export const ChessBoardMemo = React.memo(ChessBoard);
