import { App } from "./app";

function init() {
  let canvas = document.getElementById("canvas")! as HTMLCanvasElement;
  let a = new App(canvas);
  a.run();
}
init();