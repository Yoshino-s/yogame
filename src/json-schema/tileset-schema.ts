export interface TilesetInterface {
  type: "yogame-tileset";
  version: string;
  metadata: {
    id: string;
    texture: string; //The *.ytx.json file
  };
  tileset: {
    id: string;
    data?: string;
    texture: string;
    type: "wall" | "cell" | "floor" | "decorate" | "object";
    collide: "none"|"fill";
  }[];
}