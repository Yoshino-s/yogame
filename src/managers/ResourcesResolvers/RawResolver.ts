import { extname } from 'path';
import { Resolver, ResolverOption, ResolvedResource, logger, ResourceType } from './Resolver';
import { UID } from '../../utils/index';
import ResourceCache from './ResourceCache';
import constant from '../../constant';

export interface RawResolvedResource extends  ResolvedResource{
  content: ArrayBuffer;
  id: string;
}

export class RawResolver extends Resolver {
  constructor(option: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): boolean {
    if(type===ResourceType.raw) return true;
    if(extname(new URL(url).pathname) in constant.Manager.ResourceManager.RawExtensionName) return true;
    return false;
  }
  async load(path: string, id: string = UID("__inside_resources"), option?: ResolverOption): Promise<RawResolvedResource> {
    return fetch(path, (option||this.option).fetchOption).then((res: Response) => {
      logger.log(`Use raw resolver. Path:${path}, ID:${id}`);
      if(!res.ok) {
        throw Error(`Request Error, code:${res.status}.`);
      }
      return res.arrayBuffer();
    }).then((arrayBuffer: ArrayBuffer) => {
      let res: RawResolvedResource = {
        content: arrayBuffer,
        id: id
      };
      if(!(option||this.option).noCache) ResourceCache.shared.cacheIt(res);
      return res;
    });
  }
}