import Filter from "./Filter";

export default class SaturationFilter extends Filter {
  constructor(N: number) {
    super();
    this.filter = [
      0.3086 * (1 - N) + N, 0.3086 * (1 - N), 0.3086 * (1 - N), 0,
      0.6094 * (1 - N), 0.6094 * (1 - N) + N, 0.6094 * (1 - N), 0, 
      0.0820 * (1 - N), 0.0820 * (1 - N), 0.0820 * (1 - N) + N, 0, 
      0, 0, 0, 1,
    ];
  }
}