import { extname } from 'path';
import { Resolver, ResolverOption, ResolvedResource, logger, ResourceType } from './Resolver';
import { UID } from '../../utils/index';
import ResourceCache from './ResourceCache';
import constant from '../../constant';

export interface ImageResolvedResource extends  ResolvedResource{
  content: HTMLImageElement;
  id: string;
}

export class RawResolver extends Resolver {
  constructor(option: ResolverOption) {
    super(option);
  }
  shouldUse(url: string, type?: ResourceType): boolean {
    if(type===ResourceType.raw) return true;
    if(extname(new URL(url).pathname) in constant.Manager.ResourceManager.ImageExtensionName) return true;
    return false;
  }
  async load(path: string, id: string = UID("__inside_resources"), option?: ResolverOption): Promise<ImageResolvedResource> {
    logger.log(`Use image resolver. Path:${path}, ID:${id}`);
    let img = new Image();
    img.src = id;
    return new Promise((resolve, reject): void => {
      img.onload = (): void=>{
        let res = {
          content: img,
          id: id
        };
        if(!(option||this.option).noCache) ResourceCache.shared.cacheIt(res);
        resolve(res);
      };
      img.onerror = (ev): void=>{
        reject(ev);
      };
    });
  }
}