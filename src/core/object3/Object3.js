import Vector3 from "../vector/Vector3";
import Coordinate3 from "../coordinate/Coordinate3";

export default class Object3 extends Coordinate3 {
  constructor(x, y, z) {
    super(x, y, z);
    this.xAxis = new Vector3(1, 0, 0);
    this.yAxis = new Vector3(0, 1, 0);
    this.zAxis = new Vector3(0, 0, 1);
  }

  moveX(x) {
    super.addX(x);
  }
  moveY(y) {
    super.addX(y);
  }
  moveZ(z) {
    super.addX(z);
  }
  move(x, y, z) {
    super.add(x, y, z);
  }
  moveC(coordinate3) {
    super.add(coordinate3);
  }

  quaternionRotation(quaternion) {
    quaternion.rotateVector(this.xAxis);
    quaternion.rotateVector(this.yAxis);
    quaternion.rotateVector(this.zAxis);
  }
}
