import Manager from "./Manager";
import { Resolver, ResolvedResource } from './ResourcesResolvers/Resolver';
import ResourceCache from './ResourcesResolvers/ResourceCache';

export default class ResourceManager extends Manager {
  resolvers: Resolver[];
  defaultResolver: Resolver | undefined;
  cache = ResourceCache.shared;
  constructor() {
    super();
    this.resolvers = [];
  }
  async load(url: string, id?: string): Promise<ResolvedResource> {
    if(id&&this.cache.has(id)) return Promise.resolve(this.cache.get(id) as ResolvedResource);
    let resolver = this.which(url);
    if(!resolver) return Promise.reject(`Unresolved resource.Path:${url}.ID=${id}`);
    return resolver.load(url, id);
  }
  which(url: string): Resolver | null {
    return this.resolvers.find((resolver)=>resolver.shouldUse(url))||this.defaultResolver||null;
  } 
  use(resolver: Resolver, default_?: boolean): void {
    this.resolvers.push(resolver);
    if(default_) {
      this.defaultResolver = resolver;
    }
  }
}