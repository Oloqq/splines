import { Conte, makeConte } from "./conte";
import { V2 } from "./vector";

export class App {
  canvas: HTMLCanvasElement;
  ctx: Conte;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = makeConte(canvas.getContext("2d")!);
  }

  update() {}
  draw() {}
  mouseup(pos: V2) {}
  mousedown(pos: V2) {}
  mousemove(pos: V2, drag: boolean) {}

  run() {
    let drawLoop = () => {
      let t = window.setTimeout(drawLoop, 1000 / 60);
      try {
        this.update();
        this.clearAndDraw();
      }
      catch (e) {
        clearTimeout(t);
        throw e;
      }
    };
    drawLoop();
  }

  clearAndDraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }
}