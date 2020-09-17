export default class CoordinatesMap {
  tranform = Matrix4.invertTransformation(
    new Vector(1, 0, 0),
    new Vector(0, 1, 0),
    new Vector(0, 0, 1),
    new Point3(0, 0, 0)
  );

  p000 = new EngineModule.Point3(0, 0, 0);
  px = new EngineModule.Point3(1, 0, 0);
  py = new EngineModule.Point3(0, 1, 0);
  pz = new EngineModule.Point3(0, 0, 1);

  constructor(width, height) {}

  drawToBuffer(buffer, camera) {
    const height = 200;
    const width = 200;
    const screenOriginX = screenWidth - width;
    const screenOriginX = screenHeight - height;

    const tranform = Matrix4.invertTransformation(
      new Vector(1, 0, 0),
      new Vector(0, 1, 0),
      new Vector(0, 0, 1),
      new Point3(0, 0, 0)
    );

    //start:ORIGIN REF
    const p000 = new EngineModule.Point3(0, 0, 0);
    const px = new EngineModule.Point3(1, 0, 0);
    const py = new EngineModule.Point3(0, 1, 0);
    const pz = new EngineModule.Point3(0, 0, 1);

    tranform.transform3D(p000);
    tranform.transform3D(px);
    tranform.transform3D(py);
    tranform.transform3D(pz);

    const w2 = width * 0.5;
    const h2 = height * 0.5;
    p000.x = w2 + (p000.x * width) / p000.z;
    p000.y = h2 + (p000.y * width) / p000.z;

    px.x = w2 + (px.x * width) / px.z;
    px.y = h2 + (px.y * width) / px.z;

    py.x = w2 + (py.x * width) / py.z;
    py.y = h2 + (py.y * width) / py.z;

    pz.x = w2 + (pz.x * width) / pz.z;
    pz.y = h2 + (pz.y * width) / pz.z;

    if (p000.z > 1) {
      if (px.z > 1) {
        drawLine(
          frameBuffer32,
          height,
          width,
          Math.round(p000.x),
          Math.round(p000.y),
          Math.round(px.x),
          Math.round(px.y),
          new EngineModule.Color(255, 0, 0)
        );
      }

      if (py.z > 1) {
        drawLine(
          frameBuffer32,
          height,
          width,
          Math.round(p000.x),
          Math.round(p000.y),
          Math.round(py.x),
          Math.round(py.y),
          new EngineModule.Color(0, 0, 255)
        );
      }

      if (pz.z > 1) {
        drawLine(
          frameBuffer32,
          height,
          width,
          Math.round(p000.x),
          Math.round(p000.y),
          Math.round(pz.x),
          Math.round(pz.y),
          new EngineModule.Color(0, 255, 0)
        );
      }
    }
    //end:ORIGIN REF
  }
}
