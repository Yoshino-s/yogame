import Resolver, { ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";
import { extname, resolveUrl, } from "../../utils/index";

export interface JSONResolvedResource extends ResolvedResource{
  content: any;
}

export default class JSONResolver extends Resolver {
  constructor(option?: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): number {
    if(type === ResourceType.json) return 10;
    if(extname(resolveUrl(url).pathname) === "json") return 1;
    return 0;
  }
  async load(path: string, id: string, option?: ResolverOption): Promise<JSONResolvedResource> {
    return fetch(path, (option || this.option).fetchOption).then((res: Response) => {
      logger.log(`Use json resolver. Path:${path}, ID:${id}`);
      if(!res.ok) {
        throw Error(`Request Error, code:${res.status}.`);
      }
      return res.json();
    }).then((json: any) => {
      const res: JSONResolvedResource = {
        content: json,
        id: id,
      };
      if(!(option || this.option).noCache) ResourceCache.default.cacheIt(res);
      return res;
    });
  }
  private static defaultInstance: JSONResolver;

  static get default(): JSONResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new JSONResolver());
    }
  }
}