import { Logger, } from "../../utils/index";

export interface ResolverOption {
  basePath: string;
  fetchOption?: RequestInit;
  noCache: boolean;
}

export interface ResolvedResource {
  content: any;
  id: string;
}

export enum ResourceType {
  image, json, raw, tileset, texture
}

export default abstract class Resolver{
  option: ResolverOption;
  constructor(option?: ResolverOption){
    this.option = option || { basePath: "/", noCache: false, };
  }
  abstract shouldUse(url: string, type?: ResourceType): number;
  abstract async load(url: string, id: string, option?: ResolverOption): Promise<ResolvedResource>;
}

export const logger = new Logger("ResourceResolver");