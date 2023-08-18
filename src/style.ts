import { Conte } from "./utils";

export interface SplineStyle {
  curve: (ctx: Conte) => void;
  joints: (ctx: Conte) => void;
  skewers: (ctx: Conte) => void;
}

export const styles = {
  DEFAULT: {
    curve: (ctx: Conte) => {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(230, 190, 2)";
    },
    joints: (ctx: Conte) => {
      ctx.lineWidth = 1;
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
    joints: (ctx: Conte) => {
      ctx.lineWidth = 1;
    },
    skewers: (ctx: Conte) => {
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
    },
  } as SplineStyle
}