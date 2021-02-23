interface origin {
  coords: { [prop: string]: Array<number> };
  castle_left: boolean;
  castle_right: boolean;
  finder: () => void;
}
interface chessPiece {
  side: string;
  name: string;
  cur_coords: () => [number, number];
}

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

const origin: origin = {
  coords: build_coords(),
  castle_left: false,
  castle_right: false,
  finder() {
    return;
  },
};

function PieceCreator(this: any, name: string, side: string) {
  this.side = side;
  this.name = name;
  this.cur_coords = () => {
    return this.coords[this.name];
  };
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
