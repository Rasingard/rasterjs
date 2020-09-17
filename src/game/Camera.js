import Object3 from "../core/object3/Object3";
import Matrix4 from "../core/matrix/Matrix4";
import Point3 from "../core/point/Point3";

export default class Camera extends Object3 {
  constructor(x, y, z, FOV) {
    super(x, y, z);
    this.FOV = FOV;

    this.xAxis.set(1, 0, 0);
    this.yAxis.set(0, 0, 1);
    this.zAxis.set(0, -1, 0);
  }

  getTransformation() {
    return Matrix4.invertTransformation(
      this.xAxis,
      this.yAxis,
      this.zAxis,
      new Point3(this.x, this.y, this.z)
    );
  }
}
