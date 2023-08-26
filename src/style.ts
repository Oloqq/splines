import { Conte } from "./lib/conte";

export interface SplineStyle {
  curve: (ctx: Conte) => void;
  skewers: (ctx: Conte) => void;
}

export interface ControlPointStyle {
  radius: number
  applier: (ctx: Conte) => void;
}

export const styles = {
  splines: {
    DEFAULT: {
      curve: (ctx: Conte) => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(230, 190, 2)";
      },
      skewers: (ctx: Conte) => {
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "rgb(80, 120, 255)";
      },
    } as SplineStyle,

    ACTIVE: {
      curve: (ctx: Conte) => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(255, 0, 0)";
      },
      skewers: (ctx: Conte) => {
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
      },
    } as SplineStyle
  },
  points: {
    SKEWER: {
      radius: 7,
    } as ControlPointStyle,
    KNOT: {
      radius: 12
    } as ControlPointStyle
  }
}
export default styles;