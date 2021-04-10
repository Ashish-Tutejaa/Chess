import React, { useRef } from 'react';
import { chessPiece } from './moves';

interface toPiece {
	thisIsARef: React.MutableRefObject<HTMLDivElement | null>;
	name: string;
	pieceInfo: chessPiece;
}
export const Piece: (props: toPiece) => JSX.Element = ({ thisIsARef, name, pieceInfo }) => {
	const clickedRef = useRef<true | false>(false);
	const src = `${pieceInfo.side}${name[0]}`.toLowerCase();

	return (
		<div
			style={{
				backgroundImage: `url("${src}.png")`,
			}}
			ref={thisIsARef}
			onMouseMove={e => {}}
			className={`piece ${name}`}></div>
	);
};
