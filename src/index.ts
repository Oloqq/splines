import { App } from "./app";
import { V2 } from "./utils";

function getMousePos(canvas: HTMLCanvasElement, mouseEvent: MouseEvent): V2 {
  let rect = canvas.getBoundingClientRect();
  return new V2(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top);
}

function init() {
  let canvas = document.getElementById("canvas")! as HTMLCanvasElement;
  let app = new App(canvas);

  canvas.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        app.translate(10, 0);
        break;
      case "ArrowRight":
        app.translate(-10, 0);
        break;
      case "ArrowUp":
        app.translate(0, 10);
        break;
      case "ArrowDown":
        app.translate(0, -10);
        break;
      default:
        break;
    }
  })

  let causeError = document.getElementById("cause error")! as HTMLButtonElement;
  causeError.addEventListener("click", () => { app.causeError() });

  app.run();
}
init();