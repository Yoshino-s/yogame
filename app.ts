/* eslint-disable @typescript-eslint/camelcase */
import path0 from "./assets/favicon.jpg";

import Application from "./src/core/Application";
import Filter from "./src/filter/Filter";
import DecolorFilter from "./src/filter/DecolorFilter";
import Rectangle from "./src/math/graph/Rectangle";

window.onload = async function (): Promise<void>{
  const a = Array.from(document.getElementsByTagName("canvas")).find(v => v.id === "233");

  const app = new Application(a);

  const id0 = (await app.ResourceManager.load(path0)).id;

  const s = app.AnimationDisplayObject([ id0, id0, id0, id0 ,  ], [
    new Rectangle(0, 0, 16, 16),
    new Rectangle(16, 0, 16, 16),
    new Rectangle(0, 16, 16, 16),
    new Rectangle(16, 16, 16, 16),
  ]);
  s.animationInterval = 100;
  s.width = 300;
  s.height = 300;
  s.x = 100;
  s.y = 50;
  s.interaction = true;
  s.on("moveIn", () => {
    s.filter = new DecolorFilter();
  });
  s.on("moveOut", () => {
    s.filter = new Filter();
  });
  app.stage.addChildren(s);
};