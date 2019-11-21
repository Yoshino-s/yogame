export type TileType = "floor" | "decorate" | "barrier" | "entity";
export interface TileData {
  id: string;
  data: string;
  name: string;
  textureId: string;
  type: TileType;
}

export const TileDataMap = new Map<string, TileData>();
