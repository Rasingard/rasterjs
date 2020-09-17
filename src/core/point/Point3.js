import Coordinate3 from "../coordinate/Coordinate3";

export default class Point3 extends Coordinate3 {
    constructor(x, y, z) {
        super(x, y, z);
    }

    static distanceBetween(point3_1, point3_2) {
        return Math.sqrt(
            Math.pow(point3_2.getX() - point3_1.getX(), 2) +
            Math.pow(point3_2.getY() - point3_1.getY(), 2) +
            Math.pow(point3_2.getZ() - point3_1.getZ(), 2)
        );
    }

    get() {
        return new Point3(
            this.getX(),
            this.getY(),
            this.getZ()
        );
    }

    distanceTo(point3) {
        return Point3.distanceBetween(this, point3);
    }

    equals(point3) {
        return this.getX() === point3.getX() 
            && this.getY() === point3.getY()
            && this.getZ() === point3.getZ();
    }
}