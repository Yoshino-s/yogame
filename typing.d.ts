declare module "*.vert" {
  const vert: string;
  export default vert;
}

declare module "*.frag" {
  const frag: string;
  export default frag;
}

declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.json" {
  const result: any;
  export default result;
}

declare module "*.schema.js" {
  const root: { root: (obj: any) => number };
  export default root;
}
