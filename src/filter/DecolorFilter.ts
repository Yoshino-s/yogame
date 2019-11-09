import Filter from "./Filter";

export default class DecolorFilter extends Filter {
  constructor() {
    super();
    this.filter = [
      0.3086, 0.3086, 0.3086, 0,
      0.6094, 0.6094, 0.6094, 0, 
      0.0820, 0.0820, 0.0820, 0, 
      0, 0, 0, 1,
    ];
  }
}