import Filter from "./Filter";

export default class ReverseFilter extends Filter {
  constructor() {
    super();
    this.filter = [
      -1, 0, 0, 0,
      0, -1, 0, 0,
      0, 0, -1, 0,
      0, 0, 0, 1,
    ];
    this.offset = [
      1, 1, 1, 0,
    ];
  }
}