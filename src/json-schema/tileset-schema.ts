export interface Tileset {
  type: "yogame-tileset";
  version: string;
  metadata: {
    cell: number;
  };
  tileset: {
    id: string;
    x: number;
    y: number;
    data: {
      type: "wall" | "cell" | "floor" | "decorate" | "object";
      collide: "none"|"fill";
    };
  };
}