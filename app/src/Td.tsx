import React from 'react';

interface pos {
	childPosY: number;
	childPosX: number;
	loc: string;
}

type newMouseEventOnCell = React.MouseEvent<HTMLTableCellElement, MouseEvent> & pos;
interface toTd {
	i: boolean;
	row: number;
	col: number;
	j: boolean;
	piece: boolean;
	children: JSX.Element | null;
}
export const Td: (props: toTd) => JSX.Element = ({ row, col, i, j, piece, children }) => {
	return (
		<td
			id={`${row}${col}`}
			onMouseDown={(e: newMouseEventOnCell) => {
				e.loc = e.currentTarget.id;
				e.childPosX = e.currentTarget.getBoundingClientRect().left;
				e.childPosY = e.currentTarget.getBoundingClientRect().top;
				return;
			}}
			onMouseMove={(e: newMouseEventOnCell) => {
				return;
			}}
			className={`${i !== j ? 'oddCol' : 'evenCol'}`}>
			{children}
		</td>
	);
};
