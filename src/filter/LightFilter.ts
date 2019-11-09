import Filter from "./Filter";

export default class LightFilter extends Filter {
  constructor(l: number) {
    super();
    this.offset = [ l, l, l, 0, ];
  }
}