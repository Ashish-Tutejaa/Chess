import { dir } from "console";
import { Duplex } from "stream";
import { directions } from "./directions";

interface origin {
  coords: { [prop: string]: Array<number> };
  castle_left: boolean;
  castle_right: boolean;
  finder: (
    this: any,
    board: Array<Array<string>>,
    x: number,
    y: number
  ) => (number[][] | null)[] | null;
}
export interface chessPiece {
  side: string;
  name: string;
  cur_coords: () => [number, number];
  first_piece?: boolean;
}

export const check: (
  x: number,
  y: number,
  lx: number,
  ly: number
) => true | false = (x, y, lx, ly) => {
  if (x < 0 || y < 0 || x >= lx || y >= ly) return false;
  return true;
};

export const make_array: (x: number) => Array<string> = (x) => {
  let t = [];
  for (let i = 0; i < x; i++) t.push("");
  return t;
};

export const pawns = make_array(16).map((ele, i) => {
  return `P${i + 1}`;
});
export const white_pieces = ["R1", "H1", "B1", "Q1", "K1", "B2", "H2", "R2"];
export const black_pieces = ["R3", "H3", "B3", "Q2", "K2", "B4", "H4", "R4"];

const build_coords: () => { [prop: string]: Array<number> } = () => {
  let res: { [prop: string]: Array<number> } = {};
  pawns.forEach((ele, i) => {
    if (i <= 7) res[ele] = [i, 1];
    else res[ele] = [i - 8, 6];
  });
  white_pieces.forEach((ele, i) => {
    res[ele] = [i, 0];
  });
  black_pieces.forEach((ele, i) => {
    res[ele] = [i, 7];
  });
  return res;
};

const gen_direc_wrapper = (
  direction: number[][][],
  board: Array<Array<string>>,
  x0: number,
  y0: number,
  side: string
) => {
  let res = [];
  for (let i of direction) {
    res.push(gen_direc(i, board, x0, y0, side));
  }

  return res;
};

const side_finder = (name: string) => {
  if (black_pieces.includes(name)) return "B";
  if (white_pieces.includes(name)) return "W";
  if (name.length === 3 || Number(name[0]) > 8) return "B";
  return "W";
};

const gen_direc = (
  direction: number[][],
  board: Array<Array<string>>,
  x0: number,
  y0: number,
  side: string
) => {
  let res = [];
  let lx = board[0].length;
  let ly = board.length;
  for (let i = 0; i < direction[0].length; i++) {
    let nx = x0 + direction[0][i],
      ny = y0 + direction[1][i];
    if (check(nx, ny, lx, ly)) {
      if (board[ny][nx].length !== 0) {
        let targSide = side_finder(board[ny][nx]);

        if (side === targSide) {
          if (board[y0][x0][0] === "H" || board[y0][x0][0] === "K") continue;
          break;
        } else {
          res.push([nx, ny]);
          if (board[y0][x0][0] === "H" || board[y0][x0][0] === "K") continue;
          break;
        }
      }
      res.push([nx, ny]);
    }
  }
  return res;
};

const origin: origin = {
  coords: build_coords(),
  castle_left: false,
  castle_right: false,
  finder(board, x, y) {
    let lx = board[0].length,
      ly = board.length;
    if (this.name[0] === "R") {
      return gen_direc_wrapper(
        [directions.l, directions.r, directions.u, directions.d],
        board,
        x,
        y,
        this.side
      );
    } else if (this.name[0] === "B") {
      return gen_direc_wrapper(
        [directions.ul, directions.ur, directions.dl, directions.dr],
        board,
        x,
        y,
        this.side
      );
    } else if (this.name[0] === "H") {
      return gen_direc_wrapper([directions.h], board, x, y, this.side);
    } else if (this.name[0] === "K") {
      return gen_direc_wrapper([directions.k], board, x, y, this.side);
    } else if (this.name[0] === "Q") {
      const { l, r, u, d, ul, ur, dl, dr } = directions;
      return gen_direc_wrapper(
        [l, r, u, d, ul, ur, dl, dr],
        board,
        x,
        y,
        this.side
      );
    } else if (this.name[0] === "P") {
      let res = [];
      let sign = -1;
      if (this.side === "B") sign += 2;

      if (this.first_move === true) {
        if (
          check(x, y + 2 * sign, lx, ly) &&
          board[y + 2 * sign][x].length === 0
        ) {
          res.push([x, y + 2 * sign]);
        }
      }
      if (check(x + 1, y + 1 * sign, lx, ly)) {
        if (board[y + 1 * sign][x + 1].length !== 0) {
          let ts = side_finder(board[y + 1 * sign][x + 1]);
          if (ts !== this.side) res.push([x + 1, y + 1 * sign]);
        }
      }
      if (check(x - 1, y + 1 * sign, lx, ly)) {
        if (board[y + 1 * sign][x - 1].length !== 0) {
          let ts = side_finder(board[y + 1 * sign][x - 1]);
          if (ts !== this.side) res.push([x - 1, y + 1 * sign]);
        }
      }
      if (check(x, y + 1 * sign, lx, ly) && board[y + 1 * sign][x].length === 0)
        res.push([x, y + 1 * sign]);
      return [res];
    }
    return null;
  },
};

function PieceCreator(this: any, name: string, side: string) {
  this.side = side;
  this.name = name;
  this.cur_coords = () => {
    return this.coords[this.name];
  };
  if (name[0] === "P") {
    this.first_move = true;
  }
}
PieceCreator.prototype = origin;

export const Pieces: { [prop: string]: chessPiece } = {};

white_pieces.forEach((ele) => {
  Pieces[ele] = new (PieceCreator as any)(ele, "W");
});
black_pieces.forEach((ele) => {
  Pieces[ele] = new (PieceCreator as any)(ele, "B");
});
pawns.forEach((ele, i) => {
  Pieces[ele] = new (PieceCreator as any)(ele, `${i <= 7 ? "W" : "B"}`);
});

export {};
