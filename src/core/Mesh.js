export default class Mesh {
    constructor(vertexList, faceList, vertexNormals) {
        this.vertexList = vertexList;
        this.faceList = faceList;
        this.normals = Mesh.buildNormals(vertexList, faceList);
        if(vertexNormals) this.vertexNormals = vertexNormals;
    }

    static buildNormals(vertexList, faceList) {
        const normals = new Float32Array(vertexList.length);

        let normal, p1i, p2i, p3i, v1, v2;
        for (let i = 0; i < faceList.length; i += 3) {
            p1i = faceList[i] * 3;
            p2i = faceList[i + 1] * 3;
            p3i = faceList[i + 2] * 3;

            v1 = Vector.fromCoords(
                vertexList[p2i], vertexList[p2i + 1], vertexList[p2i + 2],
                vertexList[p1i], vertexList[p1i + 1], vertexList[p1i + 2]
            );

            v2 = Vector.fromCoords(
                vertexList[p3i], vertexList[p3i + 1], vertexList[p3i + 2],
                vertexList[p2i], vertexList[p2i + 1], vertexList[p2i + 2]
            );

            normal = v1.cross(v2).normalize();

            normals[i] = normal.x;
            normals[i + 1] = normal.y;
            normals[i + 2] = normal.z;
        }

        return normals;
    }
}