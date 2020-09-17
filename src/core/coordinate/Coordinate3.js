import Coordinate2 from "../coordinate/Coordinate2";

export default class Coordinate3 extends Coordinate2 {
  constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }

  get() {
    return new Coordinate3(this.getX(), this.getY(), this.getZ());
  }
  getZ() {
    return this.z;
  }
  setZ(z) {
    this.z = z;
  }
  set(x, y, z) {
    super.set(x, y);
    this.setZ(z);
  }
  setC(coordinate3) {
    this.set(coordinate3.getX(), coordinate3.getY(), coordinate3.getZ());
  }

  addZ(val) {
    this.setZ(this.getZ() + val);
  }
  add(val) {
    super.add(val);
    this.addZ(val);
  }
  addC(coordinate3) {
    super.addC(coordinate3);
    this.addZ(coordinate3.getZ());
  }

  subtractZ(val) {
    this.addZ(-val);
  }
  subtract(val) {
    super.subtract(val);
    this.subtractZ(val);
  }
  subtract(coordinate3) {
    super.subtractC(coordinate3);
    this.subtractZ(coordinate3.getZ());
  }

  divideZ(val) {
    this.setZ(this.getZ() / val);
  }
  divide(val) {
    super.divide(val);
    this.divideZ(val);
  }
  divideC(coordinate3) {
    super.divide(coordinate3);
    this.divideZ(coordinate3.getZ());
  }

  multiplyZ(val) {
    this.setZ(this.getZ() * val);
  }
  multiply(val) {
    super.multiply(val);
    this.multiplyZ(val);
  }
  multiplyC(coordinate3) {
    super.multiply(coordinate3);
    this.multiplyZ(coordinate3.getZ());
  }

  equals(coordinate3) {
    return (
      coordinate3.getX() === this.getX() &&
      coordinate3.getY() === this.getY() &&
      coordinate3.getZ() === this.getZ()
    );
  }
}
