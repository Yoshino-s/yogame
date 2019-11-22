import Application from "./src/core/Application";
import Filter from "./src/filter/Filter";
import DecolorFilter from "./src/filter/DecolorFilter";
import path0 from "./public/favicon.jpg";

window.onload = async function (): Promise<void> {
  const a = Array.from(document.getElementsByTagName("canvas")).find(v => v.id === "233");

  const app = new Application(a);

  (window as any).app = app;

  this.console.log(await app.ResourceManager.load(path0, "233"));

  const s = app.Text("233777\n2223234", "yellow");
  const c = app.Sprite("empty");
  (window as any).s = s;
  s.interaction = true;
  app.stage.interaction = true;
  let dx = 0, dy = 0;
  let sx = 0, sy = 0;
  document.addEventListener("resize", () => {
    app.fullscreen();
  });
  app.stage.on("down", function (x: number, y: number){
    app.fullscreen();
    sx = x - c.x; sy = y - c.y;
    navigator.geolocation.watchPosition(p => {
      alert(233);
      s.text = `accuracy:${p.coords.accuracy};\nalt:${p.coords.longitude};\nlat:${p.coords.latitude};`;
      if (dx === 0) {
        dy = p.coords.latitude;
        dx = p.coords.longitude;
      }
      s.y = -(p.coords.latitude - dy) * 1000000;
      s.x = (p.coords.longitude - dx) * 1000000;
    }, p => alert("fail"), {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout:1000,
    });
  });
  app.stage.on("moveOn", function (x: number, y: number) {
    c.x = x - sx;
    c.y = y - sy;
  });
  s.on("moveIn", () => {
    s.filter = new DecolorFilter();
  });
  s.on("moveOut", () => {
    s.filter = new Filter();
  });
  app.stage.addChildren(c);
  c.addChildren(s);
  app.fullscreen();
};