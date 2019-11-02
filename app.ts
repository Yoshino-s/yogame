/* eslint-disable @typescript-eslint/camelcase */
import path0 from "./assets/favicon.jpg";
import path1 from "./assets/body_wall.png";
import Application from "./src/core/Application";

window.onload = async function (): Promise<void>{
  const a = Array.from(document.getElementsByTagName("canvas")).find(v=>v.id === "233");

  const app = new Application(a);

  const id0 = (await app.ResourceManager.load(path0)).id;
  const id1 = (await app.ResourceManager.load(path1)).id;
  const s = app.DisplayObject(id0);
  s.position = { x: 200, y: 200, };
  s.center = { x: 0.5, y: 0.5, };
  s.width = 300;
  s.height = 300;
  s.filter = [
    0.8, 0, 0, 0,
    0, 0.7, 0, 0,
    0, 0, 0.2, 0,
    0, 0, 0, 1,
  ];
  app.stage.addChildren(s);
  const c = app.DisplayObject(id1);
  s.addChildren(c);
  c.globalX = 200;
  c.globalY = 200;
  c.center = { x: 0.5, y: 0.5, };
  c.width = 100;
  c.height = 100;
  c.transform = [
    1, 0,
    0, 1,
  ];
  const im = app.InteractionManager;

  let vx = 215;
  let vy = 193;

  let gx = 200;
  let gy = 200;
  
  app.on("render", function (time: number): void {
    s.x = im.mouse.status.point.x - app.rect.left;
    s.y = im.mouse.status.point.y - app.rect.top;

    gx += vx * time / 1000;
    gy += vy * time / 1000;

    c.globalX = gx;
    c.globalY = gy;
    if (c.x + c.width / 2 > 150 || c.x - c.width / 2 < -150) vx = -vx;
    if (c.y + c.height / 2 > 150 || c.y - c.height / 2 < -150) vy = -vy;
    (document.getElementById("666") as HTMLDivElement).innerHTML = `${Math.round(app.AnimationManager.fps)}`;
  });
};