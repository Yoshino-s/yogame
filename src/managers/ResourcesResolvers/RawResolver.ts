import Resolver, { ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";
import constant from "../../constant";
import { extname, resolveUrl, } from "../../utils/index";

export interface RawResolvedResource extends ResolvedResource{
  content: ArrayBuffer;
}

export default class RawResolver extends Resolver {
  constructor(option?: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): number {
    if(type === ResourceType.raw) return 10;
    if(constant.Manager.ResourceManager.RawExtensionName.indexOf(extname(resolveUrl(url).pathname)) !== -1) return 1;
    return 0;
  }
  async load(path: string, id: string, option?: ResolverOption): Promise<RawResolvedResource> {
    return fetch(path, (option || this.option).fetchOption).then((res: Response) => {
      logger.log(`Use raw resolver. Path:${path}, ID:${id}`);
      if(!res.ok) {
        throw Error(`Request Error, code:${res.status}.`);
      }
      return res.arrayBuffer();
    }).then((arrayBuffer: ArrayBuffer) => {
      const res: RawResolvedResource = {
        content: arrayBuffer,
        id: id,
      };
      if(!(option || this.option).noCache) ResourceCache.default.cacheIt(res);
      return res;
    });
  }
  private static defaultInstance: RawResolver;

  static get default(): RawResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new RawResolver());
    }
  }
}