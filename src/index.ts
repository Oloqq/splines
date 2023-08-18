import { App } from "./app";
import { V2 } from "./lib/vector";
import { Constraints } from "./splines/ControlPoint";
import { status } from "./status";

function getMousePos(canvas: HTMLCanvasElement, mouseEvent: MouseEvent): V2 {
  let rect = canvas.getBoundingClientRect();
  return new V2(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top);
}

function init() {
  let canvas = document.getElementById("canvas")! as HTMLCanvasElement;
  let app = new App(canvas);
  let mousePos = new V2(0, 0);
  let mouseDown = false;

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
    app.mousemove(mousePos, e, mouseDown);
  });
  canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    app.mouseup(mousePos, e);
  });
  canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    app.mousedown(mousePos, e);
  });

  document.getElementById("new bezier spline")!.addEventListener("click", () => {
    status.info("new bezier spline requested, not implemented");
  });

  document.getElementById("fix neighbors")!.addEventListener("click", () => {
    status.info("Fix positions of neighbors");
    if (app.grip.count() == 0) {
      status.info("No joints selected");
    }
    app.grip.addConstraints(Constraints.MOVE_WITH_NEIGHBORS);
  });

  document.getElementById("align")!.addEventListener("click", () => {
    status.info("align not implemented");
  });

  document.getElementById("mirror")!.addEventListener("click", () => {
    status.info("mirror not implemented");
  });

  (function setup_movetogether() {
    let movetogether = document.getElementById("move together")! as HTMLInputElement;
    let movetogether_applier = () => {
      if (movetogether.checked) {
        for (let s of app.splines) {
          for (let i = 0; i < s.points.length; i ++) {
            s.setConstraint(i, Constraints.MOVE_WITH_NEIGHBORS);
          }
        }
        status.info("Each control point has to be moved individually");
      }
      else {
        for (let s of app.splines) {
          for (let i = 0; i < s.points.length; i ++) {
            s.setConstraint(i, Constraints.NONE);
          }
        }
        status.info("Moving each joint will move it's skewers as well");
      }
    };
    movetogether_applier();
    status.info("Status messages are displayed here");
    movetogether.addEventListener("click", movetogether_applier);
  })();

  app.run();
}
init();