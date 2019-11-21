import Application from "./src/core/Application";
import Filter from "./src/filter/Filter";
import DecolorFilter from "./src/filter/DecolorFilter";
import path0 from "./public/favicon.jpg";

window.onload = async function (): Promise<void>{
  const a = Array.from(document.getElementsByTagName("canvas")).find(v => v.id === "233");

  const app = new Application(a);

  (window as any).app = app;

  this.console.log(await app.ResourceManager.load(path0, "233"));

  const s = app.Text("233777\n2223234");
  (window as any).s = s;
  s.interaction = true;
  s.on("moveIn", () => {
    s.filter = new DecolorFilter();
  });
  s.on("moveOut", () => {
    s.filter = new Filter();
  });
  app.stage.addChildren(s);
};