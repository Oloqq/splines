import { App } from "./app";
import { V2 } from "./utils";

function getMousePos(canvas: HTMLCanvasElement, mouseEvent: MouseEvent): V2 {
  let rect = canvas.getBoundingClientRect();
  return new V2(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top);
}

function init() {
  let canvas = document.getElementById("canvas")! as HTMLCanvasElement;
  let app = new App(canvas);
  let mousePos = new V2(0, 0);

  canvas.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        app.ctx.vtranslate(new V2(10, 0));
        break;
      case "ArrowRight":
        app.ctx.vtranslate(new V2(-10, 0));
        break;
      case "ArrowUp":
        app.ctx.vtranslate(new V2(0, 10));
        break;
      case "ArrowDown":
        app.ctx.vtranslate(new V2(0, -10));
        break;
      default:
        break;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    mousePos = app.ctx.canvsasToWorld(getMousePos(canvas, e));
    app.mousemove(mousePos);
  });
  canvas.addEventListener("mouseup", (e) => {
    app.mouseup(mousePos);
  });
  canvas.addEventListener("mousedown", (e) => {
    app.mousedown(mousePos);
  });

  let causeError = document.getElementById("cause error")! as HTMLButtonElement;
  causeError.addEventListener("click", () => { app.causeError() });

  app.run();
}
init();