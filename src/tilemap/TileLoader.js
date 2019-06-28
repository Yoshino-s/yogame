import * as PIXI from "pixi.js"

const cell = 32;

/**
 * The standard frame of texture
 * @memberof Yogame.tilemap
 * @enum {FrameObject[]}
 */
const stdTextureFrames = {
  "2x3": [
    { key: 'UL8', rect: [ 64, 0, 32, 32 ] },
    { key: 'UR4', rect: [ 96, 0, 32, 32 ] },
    { key: 'DL2', rect: [ 64, 32, 32, 32 ] },
    { key: 'DR1', rect: [ 96, 32, 32, 32 ] },
    { key: 'ULE', rect: [ 0, 64, 32, 32 ] },
    { key: 'URC', rect: [ 32, 64, 32, 32 ] },
    { key: 'ULC', rect: [ 64, 64, 32, 32 ] },
    { key: 'URD', rect: [ 96, 64, 32, 32 ] },
    { key: 'DLA', rect: [ 0, 96, 32, 32 ] },
    { key: 'DR0', rect: [ 32, 96, 32, 32 ] },
    { key: 'DL0', rect: [ 64, 96, 32, 32 ] },
    { key: 'DR5', rect: [ 96, 96, 32, 32 ] },
    { key: 'ULA', rect: [ 0, 128, 32, 32 ] },
    { key: 'UR0', rect: [ 32, 128, 32, 32 ] },
    { key: 'UL0', rect: [ 64, 128, 32, 32 ] },
    { key: 'UR5', rect: [ 96, 128, 32, 32 ] },
    { key: 'DLB', rect: [ 0, 160, 32, 32 ] },
    { key: 'DR3', rect: [ 32, 160, 32, 32 ] },
    { key: 'DL3', rect: [ 64, 160, 32, 32 ] },
    { key: 'DR7', rect: [ 96, 160, 32, 32 ] }
  ],
  "2x2": [
    { key: 'ULE', rect: [ 0, 0, 32, 32 ] },
    { key: 'URC', rect: [ 32, 0, 32, 32 ] },
    { key: 'ULC', rect: [ 64, 0, 32, 32 ] },
    { key: 'URD', rect: [ 96, 0, 32, 32 ] },
    { key: 'DLA', rect: [ 0, 32, 32, 32 ] },
    { key: 'DR0', rect: [ 32, 32, 32, 32 ] },
    { key: 'DL0', rect: [ 64, 32, 32, 32 ] },
    { key: 'DR5', rect: [ 96, 32, 32, 32 ] },
    { key: 'ULA', rect: [ 0, 64, 32, 32 ] },
    { key: 'UR0', rect: [ 32, 64, 32, 32 ] },
    { key: 'UL0', rect: [ 64, 64, 32, 32 ] },
    { key: 'UR5', rect: [ 96, 64, 32, 32 ] },
    { key: 'DLB', rect: [ 0, 96, 32, 32 ] },
    { key: 'DR3', rect: [ 32, 96, 32, 32 ] },
    { key: 'DL3', rect: [ 64, 96, 32, 32 ] },
    { key: 'DR7', rect: [ 96, 96, 32, 32 ] }
  ],
  "4x1": [
    { key: 'ULA', rect: [ 0, 0, 32, 32 ] },
    { key: 'UR0', rect: [ 32, 0, 32, 32 ] },
    { key: 'UL0', rect: [ 128, 0, 32, 32 ] },
    { key: 'UR5', rect: [ 160, 0, 32, 32 ] },
    { key: 'DLA', rect: [ 0, 32, 32, 32 ] },
    { key: 'DR0', rect: [ 32, 32, 32, 32 ] },
    { key: 'DL0', rect: [ 128, 32, 32, 32 ] },
    { key: 'DR5', rect: [ 160, 32, 32, 32 ] }
  ]
}

/**
 * An object records the infomation of one frame.
 * @typedef {object} FrameObject
 * @property {string} key - The key of the frame.
 * @property {PIXI.Rectangle|number[]} - The rectangle of the frame place.
 */

/**
 * The texturea of tile files.
 * @memberof Yogame.tilemap
 */
class TileTexture {
  /**
   * Cache of frames which has been cropped.
   * @private
   */
  frameCache = new Map();
  /**
   * All of frames.
   * @private
   */
  allFrames = new Map();
  /**
   * Load a texture.
   * @param {PIXI.Texture} texrure - The source texture.
   * @param {FrameObject} frames - The framea of the texture.
   */
  load(texture, frames) {
    if(! texture instanceof PIXI.Texture) {
      texture = PIXI.utils.TextureCache[texture];
    }
    for(let i in frames) {
      let {key, rect} = i;
      if (Array.isArray(rect)) {
        rect = new PIXI.Rectangle(...rect);
      }
      this.allFrames.set(key, {
        texture, rect
      });
    }
    return this;
  }
  /**
   * Get frame from the frames added to the loader.
   * @param {string} key - Key of the frame.
   * @param {boolean} [cache=true] - Weather the frame should be cached.
   * @return {PIXI.Texture|null}.- The frame.Null if cannot find.
   */
  getFrame(key, cache=true) {
    if(this.frameCache.has(key)) {
      return this.frameCache.get(key);
    }
    else if(this.allFrames.has(key)) {
      let frame = this.allFrames.get(key);
      frame = new PIXI.Texture(frame.texture.baseTexture, frame.rect);
      if(cache) this.frameCache.set(key, frame);
      return frame;
    }
    else {
      return null;
    }
  }
  /**
   * Clear the frame cache.
   */
  clearCache() {
    this.frameCache.clear();
  }
}

class TileTextureGroup ex

export { TileLoader, stdTextureFrames };