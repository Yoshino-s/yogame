import { extname, } from "path";
import { resolve, } from "url";
import { Resolver, ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";
import constant from "../../constant";
import { ImageCache, } from "../../renderer/WebGL/RendererTexture";

export interface ImageResolvedResource extends ResolvedResource{
  content: HTMLImageElement;
  id: string;
}

export class ImageResolver extends Resolver {
  constructor(option?: ResolverOption) {
    super(option);
    this.load("data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==", "empty");
  }
  shouldUse(url: string, type?: ResourceType): boolean {
    if(type === ResourceType.image) return true;
    if(constant.Manager.ResourceManager.ImageExtensionName.indexOf(extname(new URL(resolve(window.location.href, url)).pathname)) !== -1) return true;
    return false;
  }
  async load(path: string, id: string, option?: ResolverOption): Promise<ImageResolvedResource> {
    const img = new Image();
    img.src = path;
    return new Promise((resolve, reject): void => {
      img.onload = (): void=>{
        const res = {
          content: img,
          id: id,
        };
        logger.log(`Use image resolver. Path:${path}, ID:${id}`);
        ImageCache.set(id, img);
        if(!(option || this.option).noCache) ResourceCache.default.cacheIt(res);
        resolve(res);
      };
      img.onerror = (ev): void=>{
        reject(ev);
      };
    });
  }
  private static defaultInstance: ImageResolver;

  static get default(): ImageResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new ImageResolver());
    }
  }
}