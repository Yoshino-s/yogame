import Resolver, { ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";
import Validator from "../../json-schema/Validator";
// eslint-disable-next-line import/extensions
import validate from "../../json-schema/texture-schema.schema.js";
import RendererTexture, { ImageCache, } from "../../webgl/RendererTexture";
import Rectangle from "../../math/graph/Rectangle";
import { TextureInterface, } from "../../json-schema/texture-schema";

const validator = new Validator<TextureInterface>(validate.root);

export interface TextureResolvedResource extends ResolvedResource{
  content: TextureInterface;
}

export default class TextureResolver extends Resolver {
  gl: WebGLRenderingContext;
  constructor(gl: WebGLRenderingContext, option?: ResolverOption) {
    super(option);
    this.gl = gl;
  }
  shouldUse(url: string, type?: ResourceType): number {
    if(type === ResourceType.texture) return 10;
    return 0;
  }
  async load(json: any, id: string, option?: ResolverOption): Promise<TextureResolvedResource> {
    const t = validator.transform(json);
    if (!t) {
      const info = `Wrong format of texture data.ID: ${id}`;
      logger.error(info);
      throw Error(info);
    }
    const cell = t.metadata.cell;

    const img = new Image();
    img.src = t.metadata.img;

    await new Promise((res, rej): void => {
      img.onload = res;
      img.onerror = rej;
    });
    ImageCache.set(id, img);

    const res = {
      content: t,
      id: id,
    };
    if (!(option || this.option).noCache) ResourceCache.default.cacheIt(res);
    t.texture.forEach(v => {
      new RendererTexture(this.gl, id, new Rectangle(v.x, v.y, cell, cell), v.id);
    });
    return res;
  }
}