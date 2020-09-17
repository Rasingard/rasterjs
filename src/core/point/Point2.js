import Coordinate2 from "../coordinate/Coordinate2";

export default class Point2 extends Coordinate2 {
    constructor(x, y) {
        super(x, y);
    }

    static distanceBetween(point2_1, point2_2) {
        return Math.sqrt(
            Math.pow(point2_2.getX() - point2_1.getX(), 2) +
            Math.pow(point2_2.getY() - point2_1.getY(), 2)
        );
    }

    get() {
        return new Point2(
            this.getX(),
            this.getY()
        );
    }

    distanceTo(point2) {
        return Point2.distanceBetween(this, point2);
    }
}