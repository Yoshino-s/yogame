import { extname, } from "path";
import { resolve, } from "url";
import { Resolver, ResolverOption, ResolvedResource, logger, ResourceType, } from "./Resolver";
import ResourceCache from "./ResourceCache";

export interface JSONResolvedResource extends ResolvedResource{
  content: any;
  id: string;
}

export class JSONResolver extends Resolver {
  constructor(option?: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): boolean {
    if(type === ResourceType.json) return true;
    if(extname(new URL(resolve(window.location.href, url)).pathname) === ".json") return true;
    return false;
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