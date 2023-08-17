export interface Conte extends CanvasRenderingContext2D {
  withStyle: (styleFunc: (ctx: CanvasRenderingContext2D) => any, drawFunc: (ctx: CanvasRenderingContext2D) => any) => any
}
export function makeConte(ctx: CanvasRenderingContext2D): Conte {
  let c = ctx as any;
  c.withStyle = function (styleFunc: any, drawFunc: any) {
    this.save();
    styleFunc(this);
    drawFunc(this);
    this.restore();
  }
  return c as Conte;
}