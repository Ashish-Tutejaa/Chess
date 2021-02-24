import { type } from "os";
import React, { useEffect, useRef, useState } from "react";
import { Children } from "react";
import { createNoSubstitutionTemplateLiteral } from "typescript";
import "./App.css";
import { Pieces, make_array, chessPiece } from "./moves";
import { useAllRefs } from "./useAllRefs";

interface pos {
  childPosY: number;
  childPosX: number;
  loc: string;
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
  pieceInfo: chessPiece;
}

const Piece: (props: toPiece) => JSX.Element = ({
  thisIsARef,
  name,
  pieceInfo,
}) => {
  const clickedRef = useRef<true | false>(false);
  const src = `${pieceInfo.side}${name[0]}`.toLowerCase();

  return (
    <div
      style={{
        backgroundImage: `url("${src}.png")`,
      }}
      ref={thisIsARef}
      onMouseMove={(e) => {
        // e.stopPropagation();
      }}
      className={`piece ${name}`}
    ></div>
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
        e.loc = e.currentTarget.id;
        e.childPosX = e.currentTarget.getBoundingClientRect().left;
        e.childPosY = e.currentTarget.getBoundingClientRect().top;
        return;
      }}
      onMouseMove={(e: newMouseEventOnCell) => {
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

const ChessBoard = () => {
  const [board, setBoard] = useState<Array<Array<string>>>(initBoard);
  const [turn, setTurn] = useState<string>("W");
  const Refs = useAllRefs();
  const parentInfoRef = useRef<null | {
    x: number;
    y: number;
    name: string;
    loc: string;
    dropLoc: string[];
  }>(null);
  const clickedRef = useRef<false | true>(false);
  let a = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div
      onMouseDown={(e: newMouseEventOnDiv) => {
        const list = Array.from((e.target as HTMLDivElement).classList);

        if (!list.includes("piece")) return;
        const name = list[1];
        if (Pieces[name].side !== turn) return;
        const targetRef = Refs[name];

        if (targetRef.current !== null) {
          targetRef.current.style.zIndex = "100";
          targetRef.current.style.transform = `translateX(${
            e.clientX - 15 - e.childPosX
          }px) translateY(${e.clientY - 15 - e.childPosY}px)`;

          let dropLocations = (Pieces[name] as any).finder(
            board,
            Number(e.loc[0]),
            Number(e.loc[1])
          );

          let processed: string[] = dropLocations.reduce(
            (acc: [], cur: number[][], i: number) => {
              return [
                ...acc,
                ...cur.map((ele: number[]) => {
                  return ele.join("");
                }),
              ];
            },
            []
          );

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
              x.classList.add("selCol");
            }
          }
        }
      }}
      onMouseUp={(e) => {
        if (clickedRef.current === false || parentInfoRef.current === null)
          return;

        const { name, dropLoc } = parentInfoRef.current;
        const targetRef = Refs[name];
        let dropTarget: any = null;
        Array.from(document.elementsFromPoint(e.clientX, e.clientY)).forEach(
          (ele) => {
            if (dropTarget !== null) return;
            if (ele.nodeName === "TD") dropTarget = ele;
          }
        );

        let skip = false;
        if (dropTarget !== null && dropLoc.includes(dropTarget.id)) {
          let x = Number(dropTarget.id[1]),
            y = Number(dropTarget.id[0]);
          if (board[x][y][0] === "K") {
            if (board[x][y][1] === "1") alert("White wins");
            else alert("Black wins");
            setBoard(initBoard);
            setTurn("W");
            skip = true;
          }

          if (!skip) {
            let tboard = JSON.parse(JSON.stringify(board));
            for (let i = 0; i < tboard.length; i++) {
              for (let j = 0; j < tboard[0].length; j++) {
                if (tboard[i][j] === name) {
                  tboard[i][j] = "";
                  break;
                }
              }
            }
            tboard[Number(dropTarget.id[1])][Number(dropTarget.id[0])] = name;
            if (name[0] === "P") {
              if ("first_move" in Pieces[name])
                (Pieces[name] as any).first_move = false;
            }
            setBoard(tboard);
            setTurn((p) => (p === "W" ? "B" : "W"));
          }
        } else if (targetRef.current !== null) {
          targetRef.current.style.zIndex = "10";
          targetRef.current.style.transform = ``;
        }

        for (let j of dropLoc) {
          let x = document.getElementById(j);
          if (x !== null) {
            x.classList.remove("selCol");
          }
        }

        clickedRef.current = false;
        parentInfoRef.current = null;
      }}
      onMouseMove={(e: newMouseEventOnDiv) => {
        if (clickedRef.current === false || parentInfoRef.current === null)
          return;

        const { name: pieceName, loc: pieceLoc, x, y } = parentInfoRef.current;
        const targetRef = Refs[pieceName];

        if (targetRef.current !== null) {
          targetRef.current.style.transform = `translateX(${
            e.clientX - 15 - x
          }px) translateY(${e.clientY - 15 - y}px)`;
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
                      pieceInfo={Pieces[board[i][j]]}
                      name={`${board[i][j]}`}
                      thisIsARef={Refs[`${board[i][j]}`]}
                    />
                  );

                return (
                  <Td
                    row={j}
                    col={i}
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
