import { App } from "./app";
import { V2 } from "./lib/vector";
import { Constraint } from "./splines/ControlPoint";
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
    app.grip.applyConstraint(Constraint.MOVE_WITH_NEIGHBORS);
  });

  document.getElementById("free")!.addEventListener("click", () => {
    status.info("Removing constraint on selected knots")
    app.grip.applyConstraint(Constraint.NONE);
  });

  document.getElementById("align")!.addEventListener("click", () => {
    status.info("Aligning skewers of selected knots")
    app.grip.applyConstraint(Constraint.ALIGN);
  });

  document.getElementById("mirror")!.addEventListener("click", () => {
    status.info("Mirroring skewers of selected knots")
    app.grip.applyConstraint(Constraint.MIRROR);
  });

  document.getElementById("equal distance")!.addEventListener("click", () => {
    status.info("Keeping skewers at the same distance from the knot")
  });

  (function setup_movetogether() {
    let movetogether = document.getElementById("move together")! as HTMLInputElement;
    let movetogether_applier = () => {
      if (movetogether.checked) {
        status.info("Moving each knot will move it's skewers as well");
        for (let s of app.splines) {
          for (let i = 0; i < s.points.length; i += 3) {
            s.constrain(i, Constraint.MOVE_WITH_NEIGHBORS);
          }
        }
      }
      else {
        status.info("Each control point has to be moved individually");
        for (let s of app.splines) {
          for (let i = 0; i < s.points.length; i += 3) {
            s.constrain(i, Constraint.NONE);
          }
        }
      }
    };
    movetogether_applier();
    status.info("Status messages are displayed here");
    movetogether.addEventListener("click", movetogether_applier);
  })();

  app.run();
}
init();