import { ControlPoint, V2, Spline } from "./splines";
import { Constraints } from "./splines/ControlPoint";
import { status } from "./status";
import styles from "./style";

export const DUMMY = new ControlPoint(new V2(0, 0), true);

export type GripId = [number, number];
type GripSet = Set<string>

export class Grip {
  private points: GripSet = new Set<string>();
  private anchor: ControlPoint = DUMMY;
  private splines: Spline[];

  constructor(splines: Spline[]) {
    this.splines = splines;
  }

  count() {
    return this.points.size;
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
    this.anchor = point;
  }

  drag(pos: V2) {
    let diff = pos.sub(this.anchor);
    for (let jsonval of this.points) {
      let [splineid, pointid] = JSON.parse(jsonval);
      this.splines[splineid].shift(pointid, diff);
    }
  }

  addConstraints(con: Constraints) {
    for (let jsonval of this.points) {
      let [splineid, pointid] = JSON.parse(jsonval);
      this.splines[splineid].addConstraint(pointid, con);
    }
  }
}