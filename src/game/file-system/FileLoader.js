import CoordinatesMap from "../../core/coordinate/CoordinatesMap";
import GameObject from "../GameObject";

export default class FileLoader {
  static regexLineFloats = /[-+]?([0-9]*\.[0-9]+|[0-9]+)/g; // Line Floats
  static regexFaces = /(f )[\S ]*/g; // Faces 3i
  static regexVertex = /(v )\S* \S* \S*/g; // vertex 3f
  static regexUV = /(vt )[\S ]*/g; // Texture 2f
  static regexNormals = /(vn )[\S ]*/g; // Normals 3f
  static regexLinePolyIndex = /(?<=\/)[0-9]*/g; // get Line Vertex Index
  static regexVertexIndex = /((?<= )[0-9]+?(?=\/| ))/g;
  static regexLineProps = /-?(?<=\b)[0-9].+?(?= |\n|$)/g;
  static objMaxFaces = 12000;
  static objMaxVertices = 65535;

  static getObjectFaces(fileTxt) {
    let currentLine,
      facesCount = 0,
      UVCount = 0,
      normalsCount = 0,
      pointsList,
      pointData;

    const faces = new Uint16Array(this.objMaxFaces);
    const UV = new Uint16Array(this.objMaxFaces);
    const normals = new Uint16Array(this.objMaxFaces);
    const faceLines = fileTxt.match(this.regexFaces);

    for (let i = 0; i < faceLines.length; i++) {
      currentLine = faceLines[i];

      pointsList = currentLine.match(this.regexLineProps);

      if (pointsList.length > 4)
        throw new Error("Unable to load polygons with more than 4 vertices.");
      if (pointsList.length > 3) {
        pointsList = [
          pointsList[0],
          pointsList[1],
          pointsList[2],
          pointsList[2],
          pointsList[3],
          pointsList[0]
        ];
      }

      for (let p = 0; p < pointsList.length; p++) {
        pointData = pointsList[p].split("/");

        if (pointData.length > 0) {
          faces[facesCount++] = Number(pointData[0]) - 1;
        }

        if (pointData.length > 1) {
          UV[UVCount++] = Number(pointData[1]) - 1;
        }

        if (pointData.length > 2) {
          normals[normalsCount++] = Number(pointData[2]) - 1;
        }
      }
    }

    return {
      faces: faces.slice(0, facesCount),
      UV: UV.slice(0, UVCount),
      normals: normals.slice(0, normalsCount)
    };
  }

  static getObjectVertices(fileTxt) {
    let vertexCount = 0,
      pointC3Str;
    const vertices = new Float32Array(this.objMaxVertices);

    const verticesLines = fileTxt.match(this.regexVertex);

    for (let v = 0; v < verticesLines.length; v++) {
      pointC3Str = verticesLines[v].match(this.regexLineProps);

      vertices[vertexCount++] = Number(pointC3Str[0]); // setX
      vertices[vertexCount++] = Number(pointC3Str[1]); // setY
      vertices[vertexCount++] = Number(pointC3Str[2]); // setZ
    }

    return vertices.slice(0, vertexCount);
  }

  static getObjectUVVertices(fileTxt) {
    let vertexCount = 0,
      pointC2Str;
    const vertices = new Float32Array(
      Math.floor((this.objMaxVertices / 3) * 2)
    );

    const verticesLines = fileTxt.match(this.regexUV);

    for (let v = 0; v < verticesLines.length; v++) {
      pointC2Str = verticesLines[v].match(this.regexLineProps);

      vertices[vertexCount++] = Number(pointC2Str[0]); // setU
      vertices[vertexCount++] = Number(pointC2Str[1]); // setV
    }

    return vertices.slice(0, vertexCount);
  }

  static getNormalsVertices(fileTxt) {
    let vertexCount = 0,
      pointC3Str;
    const vertices = new Float32Array(this.objMaxVertices);

    const verticesLines = fileTxt.match(this.regexNormals);

    for (let v = 0; v < verticesLines.length; v++) {
      pointC3Str = verticesLines[v].match(this.regexLineProps);

      vertices[vertexCount++] = Number(pointC3Str[0]); // setX
      vertices[vertexCount++] = Number(pointC3Str[1]); // setY
      vertices[vertexCount++] = Number(pointC3Str[2]); // setZ
    }

    return vertices.slice(0, vertexCount);
  }

  static loadImage(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = function() {
        const canvas = new OffscreenCanvas(img.width, img.height);
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        resolve(context.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static processObjectFile(fileTxt) {
    const facesData = this.getObjectFaces(fileTxt);

    if (facesData.UV.length === 0)
      throw new Error("Object require UV to be loaded");
    if (facesData.normals.length === 0)
      throw new Error("Object require Vertex Normal to be loaded");

    return new GameObject(
      0,
      0,
      0,
      new CoordinatesMap(this.getObjectVertices(fileTxt), facesData.faces), // mesh,
      new CoordinatesMap(this.getObjectUVVertices(fileTxt), facesData.UV), // uv
      new CoordinatesMap(this.getNormalsVertices(fileTxt), facesData.normals) // texture
    );
  }

  static loadObjectFile(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("GET", url, true);
      request.onload = ev => {
        resolve(this.processObjectFile(request.responseText));
      };
      request.onerror = reject;

      request.send();
    });
  }
}
