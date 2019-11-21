import Resolver, { ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";
import constant from "../../constant";
import { ImageCache, } from "../../webgl/RendererTexture";
import { extname, resolveUrl, } from "../../utils/index";

export interface ImageResolvedResource extends ResolvedResource{
  content: HTMLImageElement;
}

export default class ImageResolver extends Resolver {
  constructor(option?: ResolverOption) {
    super(option);
    this.load("data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==", "empty");
  }
  shouldUse(url: string, type?: ResourceType): number {
    if(type === ResourceType.image) return 10;
    if(constant.Manager.ResourceManager.ImageExtensionName.indexOf(extname(resolveUrl(url).pathname)) !== -1) return 1;
    return 0;
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