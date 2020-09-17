import Coordinate3 from "../coordinate/Coordinate3";

export default class Vector3 extends Coordinate3 {
  constructor(x, y, z) {
    super(x, y, z);
  }

  static fromCoords(ax, ay, az, bx, by, bz) {
    return new Vector3(bx - ax, by - ay, bz - az);
  }

  static fromPoints(point3_1, point3_2) {
    return new Vector3(
      point3_2.getX() - point3_1.getX(),
      point3_2.getY() - point3_1.getY(),
      point3_2.getZ() - point3_1.getZ()
    );
  }

  get() {
    return new Vector3(this.getX(), this.getY(), this.getZ());
  }

  getLength() {
    return Math.sqrt(
      Math.pow(this.getX(), 2) +
        Math.pow(this.getY(), 2) +
        Math.pow(this.getZ(), 2)
    );
  }

  normalize() {
    this.divide(this.getLength());
  }

  inverse() {
    this.multiply(-1);
  }

  getDot(x, y, z) {
    return this.getX() * x + this.getY() * y + this.getZ() * z;
  }
  getDotC(vector3) {
    return this.getDot(vector3.getX(), vector3.getY(), vector3.getZ());
  }

  getCross(x, y, z) {
    return new Vector3(
      this.getY() * z - this.getZ() * y,
      this.getZ() * x - this.getX() * z,
      this.getX() * y - this.getY() * x
    );
  }
  getCrossC(vector3) {
    return this.getCross(vector3.getX(), vector3.getY(), vector3.getZ());
  }

  angleTo(x, y, z) {
    return Math.acos(this.getDot(x, y, z));
  }
  angleToC(vector3) {
    return Math.acos(this.getDotC(vector3));
  }
}
