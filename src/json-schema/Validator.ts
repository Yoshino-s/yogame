export default class Validator<T> {
  validate: (obj: any) => number;
  constructor(validate: (obj: any) => number) {
    this.validate = validate;
  }
  transform(obj: any): T | undefined {
    if (!this.validate(obj)) return obj as T;
  }
}