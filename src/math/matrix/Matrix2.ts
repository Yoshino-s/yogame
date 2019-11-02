import { Tuple, } from "../../utils/index";

type na4 = Tuple<number, 4>;
export class Matrix2 {
  buffer: na4;
  constructor(...args: na4) {
    this.buffer = args;
  }
  static UNIT(): Matrix2 {
    return new Matrix2(1, 0, 0, 1);
  }
}