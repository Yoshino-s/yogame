import RendererTexture from "../webgl/RendererTexture";
import { TextureInterface, } from "../json-schema/texture-schema";

type Texture = {
  id: string;
  x: number;
  y: number;
  imgId: string;
  width: number;
  height: number;
  rendererTexture?: RendererTexture;
}
export default class TextureCache {
  private textureMap = new Map<string, Texture>();
  private dataMap = new Map<string, TextureInterface>();
  register(textureData: TextureInterface, imgId: string): void {
    if (this.dataMap.has(textureData.metadata.id)) return;
    const cell = textureData.metadata.cell;
    this.dataMap.set(textureData.metadata.id, textureData);
    textureData.texture.forEach(v => {
      this.textureMap.set(v.id, {
        id: v.id,
        x: v.x,
        y: v.y,
        imgId: imgId,
        height: v.height ?? cell,
        width: v.width ?? cell,
      });
    });
  }
  getTexture(): void {
    //TODO
  }
}