/**
 * Type of tiles.
 * @enum {number}
 * @memberof Yogame.tilemap
 */
const TileType = {
  empty: 0,
  floor: 1,
  wall: 2,
  hole: 3,
  cell: 4,
  decoration: 5,
  cover: 6,
  cover_base: 7,
  
}
/**
 * Type of tiles' pattern.
 * @enum {number}
 * @memberof Yogame.tilemap
 */
const TilePatternType = {
  full: 0, 
  half: 1,
  horizon: 2,
  vertical: 3,
  single: 4,
}

const allowPattern = {
  []
}
/**
 * The tile prototype.
 * @memberof Yogame.tilemap
 * @param {object} options
 * @param {number} id - Id of tile.
 * @param {string} name - Name of tile.
 * @param {Yogame.tilemap.TileType} type - Type of tile.
 * @param {Yogame.tilemap.TilePatternType} patternType - Pattern type of tile.
 * @param {Yogame.tilemap.TileTexture} options.texture - The texture of tile.
 */
class TilePrototype {
  constructor(options) {
    this.id = options.id | -1;
    this.name = options.name | 'No name';
    this.type = options.type | TileType.empty;
    this.patternType = options.patternType | TilePatternType.single;
    this.texture = options.texture;
  }
  getDrawFrame(pattern) {
    
  }
}
/**
 * The single tile used in the tilemap.
 * @memberof Yogame.tilemap
 * @param {TileProto} tileProto - the  prototype of tile. 
 */
class Tile {
  constructor(protoTileData) {
    this._protoTileData = protoTileData;
  }
  /**
   * Clone a tile with same TileData prototype.
   * @return Yogame.tilemap.Tile
   */
  clone() {
    return new Tile(this._protoTileData);
  }
}

export { Tile };