import { ResolvedResource, logger, } from "./Resolver";

export default class ResourceCache {
  identity: string;
  cache: Map<string, ResolvedResource>;
  constructor(identity?: string) {
    this.identity = identity ? identity : "";
    this.cache = new Map();
  }
  cacheIt(resource: ResolvedResource): void {
    logger.log(`Cache resource.ID:${resource.id}`);
    this.cache.set(resource.id, resource);
  }
  has(id: string): boolean {
    return this.cache.has(id);
  }
  get(id: string): ResolvedResource | undefined {
    return this.cache.get(id);
  }
  remove(id: string): void {
    this.cache.delete(id);
  }
  clear(): void {
    this.cache.clear();
  }
  private static defaultInstance: ResourceCache;

  static get default(): ResourceCache {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new ResourceCache());
    }
  }
}