import React, { useEffect, useRef, useState } from "react";
import { Children } from "react";
import "./App.css";
import { Pieces, make_array } from "./moves";
import { useAllRefs } from "./useAllRefs";

interface pos {
  childPosY: number;
  childPosX: number;
}

type newMouseEventOnDiv = React.MouseEvent<HTMLDivElement, MouseEvent> & pos;

type newMouseEventOnCell = React.MouseEvent<HTMLTableCellElement, MouseEvent> &
  pos;

interface toTd {
  i: boolean;
  row: number;
  col: number;
  j: boolean;
  piece: boolean;
  children: JSX.Element | null;
}

interface toPiece {
  thisIsARef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
}

const Piece: (props: toPiece) => JSX.Element = ({ thisIsARef, name }) => {
  const clickedRef = useRef<true | false>(false);

  return (
    <div
      ref={thisIsARef}
      onMouseMove={(e) => {
        e.stopPropagation();
      }}
      className={`piece ${name}`}
    >
      {name}
    </div>
  );
};

const Td: (props: toTd) => JSX.Element = ({
  row,
  col,
  i,
  j,
  piece,
  children,
}) => {
  return (
    <td
      id={`${row}${col}`}
      onMouseDown={(e: newMouseEventOnCell) => {
        e.childPosX = e.currentTarget.getBoundingClientRect().left;
        e.childPosY = e.currentTarget.getBoundingClientRect().top;
        return;
      }}
      onMouseMove={(e: newMouseEventOnCell) => {
        e.childPosX = e.currentTarget.getBoundingClientRect().left;
        e.childPosY = e.currentTarget.getBoundingClientRect().top;
        return;
      }}
      className={`${i !== j ? "oddCol" : "evenCol"}`}
    >
      {children}
    </td>
  );
};

const initBoard: Array<Array<string>> = [];
make_array(8).forEach((ele) => {
  initBoard.push(make_array(8));
});
for (let i in Pieces) {
  let [x, y] = Pieces[i].cur_coords();
  initBoard[7 - y][x] = Pieces[i].name;
}
console.log(initBoard);

const ChessBoard = () => {
  const [board, setBoard] = useState<Array<Array<string>>>(initBoard);
  const Refs = useAllRefs();
  const parentNameRef = useRef<string | null>(null);
  const clickedRef = useRef<false | true>(false);
  const parentY = useRef<number | null>(null);
  const parentX = useRef<number | null>(null);
  let a = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div
      onMouseDown={(e: newMouseEventOnDiv) => {
        if (
          Array.from((e.target as HTMLDivElement).classList).includes(
            "piece"
          ) === false
        )
          return;
        const targetRef =
          Refs[Array.from((e.target as HTMLDivElement).classList)[1]];
        if (targetRef.current !== null) {
          targetRef.current.style.top = `${e.clientY - 15 - e.childPosY}px`;
          targetRef.current.style.left = `${e.clientX - 15 - e.childPosX}px`;
          clickedRef.current = true;
          parentNameRef.current = Array.from(
            (e.target as HTMLDivElement).classList
          )[1];
          parentY.current = e.childPosY;
          parentX.current = e.childPosX;
        }
      }}
      onMouseUp={(e) => {
        console.log(document.elementsFromPoint(e.clientX, e.clientY));
        clickedRef.current = false;
        parentX.current = null;
        parentY.current = null;
      }}
      onMouseMove={(e: newMouseEventOnDiv) => {
        if (clickedRef.current === false) return;
        const targetRef = Refs[parentNameRef.current as string];
        if (targetRef.current !== null) {
          targetRef.current.style.top = `${
            e.clientY - 15 - (parentY.current as number)
          }px`;
          targetRef.current.style.left = `${
            e.clientX - 15 - (parentX.current as number)
          }px`;
        }
      }}
      className="board"
    >
      <table>
        <tbody>
          {a.map((i) => (
            <tr>
              {a.map((j) => {
                let pieceRN = null;
                if (board[i][j] !== "")
                  pieceRN = (
                    <Piece
                      name={`${board[i][j]}`}
                      thisIsARef={Refs[`${board[i][j]}`]}
                    />
                  );

                return (
                  <Td
                    row={i}
                    col={j}
                    piece={i === 0 && j === 0}
                    i={i % 2 === 1}
                    j={j % 2 === 0}
                  >
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

const App = () => {
  return (
    <div className="wrapper">
      <ChessBoard />
    </div>
  );
};

export default App;
