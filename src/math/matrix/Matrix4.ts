import { Tuple, } from "../../utils/index";
import { Matrix2, } from "./Matrix2";

type na16 = Tuple<number, 16>;
export class Matrix4 {
  buffer: na16;
  constructor(...args: na16) {
    this.buffer = args;
  }
  static UNIT(): Matrix4 {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }
  static fromMatrix2(mat2: Matrix2): Matrix4 {
    return new Matrix4(
      mat2.buffer[0], mat2.buffer[1], 0, 0,
      mat2.buffer[2], mat2.buffer[3], 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }
}