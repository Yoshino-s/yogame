import { UID, } from "../utils/index";
import Logger from "../utils/logger";
import DisplayObject from "../core/DisplayObject";

export const logger = new Logger("Sprite");
export default class Sprite extends DisplayObject {
  uid = UID("Sprite");
}
