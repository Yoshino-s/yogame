/* eslint-disable @typescript-eslint/camelcase */
import path0 from "./assets/favicon.jpg";
import Application from "./src/core/Application";

window.onload = async function (): Promise<void>{
  const a = Array.from(document.getElementsByTagName("canvas")).find(v => v.id === "233");

  const app = new Application(a);

  this.console.log(app.width, app.height);

  const id0 = (await app.ResourceManager.load(path0)).id;
  const s = app.DisplayObject(id0);
  s.width = 300;
  s.height = 300;
  s.interaction = true;
  s.on("moveIn", () => this.console.log("moveIn"));
  s.on("moveOut", () => this.console.log("moveOut"));
  s.on("move", () => this.console.log("move"));
  s.on("up", () => this.console.log("up"));
  s.on("upOut", () => this.console.log("upOut"));
  s.on("down", () => this.console.log("down"));  
  app.stage.addChildren(s);
};