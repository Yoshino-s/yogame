import { extname } from 'path';
import { Resolver, ResolverOption, ResolvedResource, logger, ResourceType } from './Resolver';
import { UID } from '../../utils/index';
import ResourceCache from './ResourceCache';

export interface JSONResolvedResource extends ResolvedResource{
  content: any;
  id: string;
}

export class RawResolver extends Resolver {
  constructor(option: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): boolean {
    if(type===ResourceType.json) return true;
    if(extname(new URL(url).pathname) === ".json") return true;
    return false;
  }
  async load(path: string, id: string = UID("__inside_resources"), option?: ResolverOption): Promise<JSONResolvedResource> {
    return fetch(path, (option||this.option).fetchOption).then((res: Response) => {
      logger.log(`Use json resolver. Path:${path}, ID:${id}`);
      if(!res.ok) {
        throw Error(`Request Error, code:${res.status}.`);
      }
      return res.json();
    }).then((json: any) => {
      let res: JSONResolvedResource = {
        content: json,
        id: id
      };
      if(!(option||this.option).noCache) ResourceCache.shared.cacheIt(res);
      return res;
    });
  }
}