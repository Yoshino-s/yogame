import * as PIXI from "pixi.js";
/** @namespace PIXI */
/**
 * @name DisplayObject
 * @class
 * @memberof PIXI
*/
/**
 * @name Container
 * @class
 * @extends PIXI.DisplayObject
 * @memberof PIXI
*/

/**
 * This namespace contains layer extending PIXI.Container.
 * @namespace Yogame.plugins.layer
 */
/**
 * The default layer set of different objects.
 * @memberof Yogame.plugins.layer
 * @enum {number}
 */
const LAYER = {
  /** reserved layer 0*/
  RESERVED_0: 0,
  /** reserved layer 1*/
  RRSERVED_1: 1,
  /** reserved layer 2*/
  RESERVED_2: 2,
  /** background layer 2*/
  BACKGROUND: 3,
  /** tile layer 0*/
  TILE_0:4,
  /** tile layer 1*/
  TILE_1:5,
  /** tile layer 2*/
  TILE_2:6,
  /** ENTITU layer 0*/
  ENTITY_0:7,
  /** ENTITU layer 1*/
  ENTITY_1:8,
  /** ENTITU layer 2*/
  ENTITY_2: 9,
  /** UI layer 0*/
  UI_0:10,
  /** UI layer 1*/
  UI_1:11,
  /** UI layer 2*/
  UI_2:12,
  /** reserved layer 3*/
  RESERVED_3: 13,
  /** reserved layer 4*/
  RRSERVED_4: 14,
  /** reserved layer 5*/
  RESERVED_5: 15,
};

const ConPrototype = PIXI.Container.prototype;
/**
 * Real children aray.
 * @name PIXI.Container#_children
 * @type {PIXI.DisplayObject[]}
 */
ConPrototype._children = [];
/**
 * Dirty check flag.
 * @name PIXI.Container#dirty
 * @type {boolean}
 */
ConPrototype.dirty = false;
/**
 * Proxy of children aray.
 * @name PIXI.Container#children
 * @type {Proxy<PIXI.DisplayObject[]>}
 */
Object.defineProperty(ConPrototype, "childen", {
  get() {
    if(!this._childrenProxy) {
      let self = this;
      this._childrenProxy = new Proxy(this._children, {
        set: function(target, property, value, receiver) {
          self.dirty = true;
          return Reflect.set(target, property, value, receiver);
        }
      });
    }
    return this._childrenProxy;
  }
});
let _parent_renderCanvas = ConPrototype._renderCanvas;
let _parent_renderWebGL = ConPrototype._renderWebGL;
ConPrototype._renderCanvas = function(renderer) {
  if(this.dirty) {
    this._children.sort((a,b)=>(a.zindex||0)<(b.zindex||0));
    this.dirty = false;
  }
  _parent_renderCanvas(renderer);
};
ConPrototype._renderWebGL = function(renderer) {
  if(this.dirty) {
    this._children.sort((a,b)=>(a.zindex||0)<(b.zindex||0));
    this.dirty = false;
  }
  _parent_renderWebGL(renderer);
};
/**
 * Zindex of object.
 * @name PIXI.DisplayObject#zindex
 * @type {number}
 */
const DisPrototype = PIXI.DisplayObject.prototype;
DisPrototype._zindex = LAYER.BACKGROUND;
Object.defineProperty(DisPrototype, "zindex", {
  get() {return this._zindex;},
  set(v) {
    if(v === this._zindex || !Number.isFinite(v)) return;
    if(this.parent) {
      this.parent.dirty = true;
    }
    this._zindex = v;
  }
});

export default {
  LAYER
};
