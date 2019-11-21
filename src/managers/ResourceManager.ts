import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import Resolver, { ResolvedResource, ResourceType, } from "./ResourcesResolvers/Resolver";
import ResourceCache from "./ResourcesResolvers/ResourceCache";
import { UID, } from "../utils/index";

interface ResourceManagerEvents {
  "load": (url: string, id?: string) => void;
}

type ResourceManagerEmitter = StrictEventEmitter<EventEmitter, ResourceManagerEvents>;

export default class ResourceManager extends (EventEmitter as { new(): ResourceManagerEmitter }) {
  resolvers: Resolver[];
  defaultResolver: Resolver | undefined;
  cache = ResourceCache.default;
  constructor() {
    super();
    this.resolvers = [];
  }
  async load(url: string, id: string = UID("__inside_resources"), type?: ResourceType): Promise<ResolvedResource> {
    if(id && this.cache.has(id)) return Promise.resolve(this.cache.get(id) as ResolvedResource);
    this.emit("load", url, id);
    const resolver = this.which(url, type);
    if(!resolver) return Promise.reject(`Unresolved resource.Path:${url}.ID=${id}`);
    return resolver.load(url, id);
  }
  which(url: string, type?: ResourceType): Resolver | null {
    let index = -1;
    this.resolvers.reduce((perviousPriority: number, resolver: Resolver, i: number): number => {
      const priority = resolver.shouldUse(url, type);
      if (priority > perviousPriority) index = i;
      return priority;
    }, 0);
    return index !== -1 ? this.resolvers[index] : (this.defaultResolver || null);
  } 
  use(resolver: Resolver, default_?: boolean): void {
    this.resolvers.push(resolver);
    if(default_) {
      this.defaultResolver = resolver;
    }
  }
  private static defaultInstance: ResourceManager;

  static get default(): ResourceManager {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new ResourceManager());
    }
  }
}