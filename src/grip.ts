import { ControlPoint, V2, Spline } from "./splines";
import styles from "./style";

export const DUMMY = new ControlPoint(new V2(0, 0), styles.points.JOINT);

export type GripId = [number, number];
type GripSet = Set<string>

export class Grip {
  points: GripSet = new Set<string>();
  anchor: ControlPoint = DUMMY;
  splines: Spline[];

  constructor(splines: Spline[]) {
    this.splines = splines;
  }

  clear() {
    for (let jsonval of this.points) {
      let [splineid, pointid] = JSON.parse(jsonval);
      this.splines[splineid].points[pointid].active = false;
    }
    this.anchor = DUMMY;
    this.points.clear();
  }

  expand(point: ControlPoint, location: GripId) {
    point.active = true;
    this.points.add(JSON.stringify(location));
    console.log(this.points);
    this.anchor = point;
  }

  drag(pos: V2) {
    let diff = pos.sub(this.anchor);
    for (let jsonval of this.points) {
      let [splineid, pointid] = JSON.parse(jsonval);
      this.splines[splineid].shift(pointid, diff);
    }
  }
}