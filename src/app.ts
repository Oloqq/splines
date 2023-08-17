import { Conte, makeConte } from "./utils";
import style from "./style";

export class App {
  canvas: HTMLCanvasElement;
  ctx: Conte;

  x: number = 500;
  dx: number = 10;
  obj: any

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = makeConte(canvas.getContext("2d")!);

    this.obj = {
      bruh: 600
    }
  }

  run() {
    let drawLoop = () => {
      let t = window.setTimeout(drawLoop, 1000 / 60);
      try {
        this.update();
        this.draw();
      }
      catch (e) {
        clearTimeout(t);
        throw e;
      }
    };
    drawLoop();
  }

  update() {
    if (this.obj.bruh == 500) {
      console.log("a");
    }

    this.x += this.dx;
    if (this.x > 800) {
      this.dx = -10;
    } else if (this.x < 0) {
      this.dx = 10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.withStyle(style.default, () => {
      this.ctx.beginPath();
      this.ctx.moveTo(200, 200);
      this.ctx.bezierCurveTo(300, 200, 400, 200, this.x, 500);
      this.ctx.stroke();
    });
  }

  causeError() {
    console.log("causing error");
    this.obj = undefined;
  }
}