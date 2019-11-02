import { Tuple, } from "../../utils/index";

export function m224(mat2: Tuple<number, 4>): Tuple<number, 16> {
  return [
    mat2[0], mat2[1], 0, 0,
    mat2[2], mat2[3], 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}