import { Logger } from "../../utils/index";

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
  image, json, raw
}

export abstract class Resolver{
  option: ResolverOption;
  constructor(option: ResolverOption){
    this.option = option;
  }
  abstract shouldUse(url: string, type?: ResourceType): boolean;
  abstract async load(url: string, id?: string, option?: ResolverOption): Promise<ResolvedResource>;
}

export const logger = new Logger("ResourceResolver");