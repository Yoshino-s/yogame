export interface TextureInterface {
  type: "yogame-texture";
  version: string;
  metadata: {
    id: string;
    cell: number;
    img: string;
  };
  texture: {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
  }[];
}