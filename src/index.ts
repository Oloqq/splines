import { App } from "./app";

function init() {
  let canvas = document.getElementById("canvas")! as HTMLCanvasElement;
  let app = new App(canvas);

  let causeError = document.getElementById("cause error")! as HTMLButtonElement;
  causeError.addEventListener("click", () => { app.causeError() });

  app.run();
}
init();