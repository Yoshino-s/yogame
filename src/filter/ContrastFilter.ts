import Filter from "./Filter";

export default class ContrastFilter extends Filter {
  constructor(N: number) {
    super();
    const o = (1 - N) / 2;
    this.filter = [
      N, 0, 0, 0,
      0, N, 0, 0,
      0, 0, N, 0,
      0, 0, 0, 1,
    ];
    this.offset = [ o, o, o, 0, ];
  }
}