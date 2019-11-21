import { Tuple, } from "../utils/index";

export default class Filter {
  filter: Tuple<number, 16> = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
  offset: Tuple<number, 4> = [
    0, 0, 0, 0,
  ]
  setOpacity(opacity: number) {
    this.filter[15] = opacity;
  }
}