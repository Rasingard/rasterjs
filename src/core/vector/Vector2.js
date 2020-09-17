import Coordinate2 from '../coordinate/Coordinate2'

export default class Vector2 extends Coordinate2 {
    constructor(x, y) {
        super(x, y);
    }

    static fromCoords(ax, ay, bx, by) {
        return new Vector2d(
            bx - ax,
            by - ay
        );
    }

    static fromPoints(point2_1, point2_2) {
        return new Vector2d(
            point2_1.getX(),
            point2_1.getY(),

            point2_2.getX(),
            point2_2.getY()
        );
    }

    get() {
        return new Vector2(
            this.getX(),
            this.getY()
        )
    }

    getLength() {
        return Math.sqrt(
            Math.pow(this.getX(), 2) +
            Math.pow(this.getY(), 2)
        );
    }

    normalize() {
        this.divide(this.getLength());
    }

    inverse() {
        this.multiply(-1);
    }

    angleTo(x, y) {
        return Math.atan2(y, x) - Math.atan2(this.getY(), this.getX());
    }
    angleToC(vector2) {
        return this.angleTo(vector2.getX(), vector2.getY());
    }

    dot(x, y) {
        this.multiplyX(x);
        this.multiplyY(y);
    }
    dotC(vector2) {
        this.dot(
            vector2.getX(),
            vector2.getY()
        );
    }
}