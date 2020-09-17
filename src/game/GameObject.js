import Object3 from "../core/object3/Object3";

export default class GameObject extends Object3 {
    constructor(x, y, z, mesh, uv, normals) {
        super(x, y, z);
        this.mesh = mesh;
        this.uv = uv;
        this.normals = normals;
    }
}