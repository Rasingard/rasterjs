window.addEventListener("DOMContentLoaded", function() {
  function clampX(val, width) {
    return Math.max(Math.min(val, width - 1), 0);
  }

  function setZBuffered32Color(frameBuffer32, zBuffer, frameW, x, y, z, color) {
    const pixelIndex = x + y * frameW;
    if(!zBuffer[pixelIndex] || zBuffer[pixelIndex] > z) {
      frameBuffer32[pixelIndex] = (255 << 24) | (color.getB() << 16) | (color.getG() << 8) | color.getR();
      zBuffer[pixelIndex] = z;
    }
  }

  function setBuffer32Color(frameBuffer32, frameH, frameW, x, y, color) {
    const pixelIndex = x + y * frameW;
    frameBuffer32[pixelIndex] =
      (255 << 24) | (color.getB() << 16) | (color.getG() << 8) | color.getR();
  }

  function baricentricValues(x, y, p1, p2, p3) {
    const dy23 = p2.y - p3.y;
    const dx32 = p3.x - p2.x;
    const dx13 = p1.x - p3.x;
    const dy31 = p3.y - p1.y;
    const dy13 = p1.y - p3.y;

    const b = (dy23 * dx13) + (dx32 * dy13);
    const bx = x - p3.x;
    const by = y - p3.y;
    const w1 = ((dy23 * bx) + (dx32 * by)) / b;
    const w2 = ((dy31 * bx) + (dx13 * by)) / b;
    const w3 = 1 - w1 - w2;

    return [w1, w2, w3];
  }

  function interpolateLine(
    frameBuffer,
    zBuffer,
    height,
    width,
    p1x,
    p1z,
    p2x,
    p2z,
    y,
    color
  ) {
    if (p1x < p2x) {
      const zDelta = p2z - p1z;
      const xDelta = p2x - p1x;
      const zStep = xDelta !== 0 ? zDelta / xDelta : 0;
      let z = p1z, i;

      for (let x = p1x; x <= p2x; x++) {
        i = x + y * width;

        setZBuffered32Color(
          frameBuffer,
          zBuffer,
          width,
          x,
          y,
          z,
          color.getCopy().shift(1 / z)
        );

        z += zStep;
      }
    } else {
      const zDelta = p1z - p2z;
      const xDelta = p1x - p2x;
      const zStep = xDelta !== 0 ? zDelta / xDelta : 0;
      let z = p2z, i;

      for (let x = p2x; x <= p1x; x++) {
        i = x + y * width;

        setZBuffered32Color(
          frameBuffer,
          zBuffer,
          width,
          x,
          y,
          z,
          color.getCopy().shift(1 / z)
        );

        z += zStep;
      }
    }
  }

  function drawPolyZ(frameBuffer, zBuffer, height, width, p1, p2, p3, color) {
    if (p1.y > p2.y) {
      const t = p1;
      p1 = p2;
      p2 = t;
    }

    if (p1.y > p3.y) {
      const t = p1;
      p1 = p3;
      p3 = t;
    }

    if (p2.y > p3.y) {
      const t = p2;
      p2 = p3;
      p3 = t;
    }

    const deltaX13 = p3.x - p1.x;
    const s13 = deltaX13 !== 0 ? deltaX13 / (p3.y - p1.y) : 0;
    const stepX13 = Math.floor(s13);
    const stepErr13 = Math.abs(s13 - Math.floor(s13));

    const deltaX12 = p2.x - p1.x;
    const s12 = deltaX12 !== 0 ? deltaX12 / (p2.y - p1.y) : 0;
    const stepX12 = Math.floor(s12);
    const stepErr12 = Math.abs(s12 - Math.floor(s12));

    const deltaY12 = p2.y - p1.y;
    const deltaY13 = p3.y - p1.y;

    const deltaZ13 = p3.z - p1.z; // Z 1 > 3
    const stepZ13 = deltaY13 !== 0 ? deltaZ13 / deltaY13 : 0;

    const deltaZ12 = p2.z - p1.z; // Z 1 > 2
    const stepZ12 = deltaY12 !== 0 ? deltaZ12 / deltaY12 : 0;

    let y = Math.floor(p1.y);
    let y2 = Math.floor(p2.y);
    let x12 = Math.floor(p1.x);
    let x13 = Math.floor(p1.x);
    let x12err = stepErr12;
    let x13err = stepErr13;

    let z12 = p1.z;
    let z13 = z12;

    for (; y < y2; y++) {
      if (y >= 0 || y < height) {
        interpolateLine(
          frameBuffer,
          zBuffer,
          height,
          width,
          clampX(x12, width),
          z12,
          clampX(x13, width),
          z13,
          y,
          color
        );
      }

      x12 += stepX12;
      x13 += stepX13;
      x12err += stepErr12;
      x13err += stepErr13;

      z12 += stepZ12;
      z13 += stepZ13;

      if (x12err >= 1) {
        x12 += 1;
        x12err -= 1;
      }

      if (x13err >= 1) {
        x13 += 1;
        x13err -= 1;
      }
    }

    const deltaX23 = p3.x - p2.x;
    const s23 = deltaX23 !== 0 ? deltaX23 / (p3.y - p2.y) : 0;
    const stepX23 = Math.floor(s23);
    const stepErr23 = Math.abs(s23 - Math.floor(s23));

    const deltaY23 = p3.y - p2.y;

    const deltaZ23 = p3.z - p2.z; // Z 2 > 3
    const stepZ23 = deltaY23 !== 0 ? deltaZ23 / deltaY23 : 0;

    let y3 = Math.floor(p3.y);
    let x23 = Math.floor(p2.x);
    let x23err = stepErr23;

    let z23 = p2.z;

    for (; y2 < y3; y2++) {
      if (y2 >= 0 || y2 < height) {
        interpolateLine(
          frameBuffer,
          zBuffer,
          height,
          width,
          clampX(x23, width),
          z23,
          clampX(x13, width),
          z13,
          y2,
          color,
          p1, p2, p3
        );
      }

      x23 += stepX23;
      x13 += stepX13;
      x23err += stepErr23;
      x13err += stepErr13;

      z23 += stepZ23;
      z13 += stepZ13;

      if (x23err >= 1) {
        x23 += 1;
        x23err -= 1;
      }

      if (x13err >= 1) {
        x13 += 1;
        x13err -= 1;
      }
    }
  }

  function drawLine(frame, frameH, frameW, x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1,
      dy = Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1,
      err = (dx > dy ? dx : -dy) / 2,
      e2 = err;

    while (true) {
      if (x0 >= 0 && x0 < frameW - 1 && y0 >= 0 && y0 < frameH - 1) {
        setBuffer32Color(frame, frameH, frameW, x0, y0, color);
      }
      if (x0 === x1 && y0 === y1) break;
      e2 = err;
      if (e2 > -dx) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dy) {
        err += dx;
        y0 += sy;
      }
    }
  }

  import("./core/Engine.js").then(EngineModule => {
    import("./game/GameModule.js").then(async GameModule => {
      function drawRef(matrix) {}

      const oldHouseTextureData = await GameModule.FileLoader.loadImage(
        "../src/assets/old-house/old-house-texture.jpg"
      );

      const oldHouseNormalData = await GameModule.FileLoader.loadImage(
        "../src/assets/old-house/old-house-normals.jpg"
      );

      const file = await GameModule.FileLoader.loadObjectFile(
        "../src/assets/old-house/old-house.obj"
      );

      const character = new GameModule.Character(0, 0, 0);
      const landscape = file;// new GameModule.Landscape(-8, 0, -8, 16, 16);

      const inputs = () => {};

      const gameLogic = () => {};

      function renderer(viewport) {
        const tranform = character.camera.getTransformation();
        const meshFacesCount = landscape.mesh.getLength();
        const width = viewport.width;
        const height = viewport.height;
        const imageData = new ImageData(width, height);
        const zBuffer = new Float32Array(width * height);
        const frameBuffer = new ArrayBuffer(imageData.data.length);
        const frameBuffer8 = new Uint8ClampedArray(frameBuffer);
        const frameBuffer32 = new Uint32Array(frameBuffer);
        const color = new EngineModule.Color(255, 255, 255);
        const color2 = new EngineModule.Color(98, 98, 98);

        /*
        const projection = EngineModule.Matrix4.perspective(
          height,
          width,
          1,
          1000,
          90
        );
        */

        let p1i, p2i, p3i, p1, p2, p3;
        for (let i = 0; i < meshFacesCount; i += 3) {
          p1i = landscape.mesh.map[i] * 3;
          p2i = landscape.mesh.map[i + 1] * 3;
          p3i = landscape.mesh.map[i + 2] * 3;

          p1 = new EngineModule.Point3(
            landscape.mesh.coordinates[p1i] + landscape.getX(),
            landscape.mesh.coordinates[p1i + 1] + landscape.getY(),
            landscape.mesh.coordinates[p1i + 2] + landscape.getZ()
          );

          p2 = new EngineModule.Point3(
            landscape.mesh.coordinates[p2i] + landscape.getX(),
            landscape.mesh.coordinates[p2i + 1] + landscape.getY(),
            landscape.mesh.coordinates[p2i + 2] + landscape.getZ()
          );

          p3 = new EngineModule.Point3(
            landscape.mesh.coordinates[p3i] + landscape.getX(),
            landscape.mesh.coordinates[p3i + 1] + landscape.getY(),
            landscape.mesh.coordinates[p3i + 2] + landscape.getZ()
          );

          // to cameraSpace
          tranform.transform3D(p1);
          tranform.transform3D(p2);
          tranform.transform3D(p3);

          if (p1.z < 0.1 || p2.z < 0.1 || p3.z < 0.1) continue;

          // to frameSpace
          const w2 = width * 0.5;
          const h2 = height * 0.5;
          p1.x = w2 + (p1.x * width) / p1.z;
          p1.y = h2 + (p1.y * width) / p1.z;
          p2.x = w2 + (p2.x * width) / p2.z;
          p2.y = h2 + (p2.y * width) / p2.z;
          p3.x = w2 + (p3.x * width) / p3.z;
          p3.y = h2 + (p3.y * width) / p3.z;

          drawPolyZ(frameBuffer32, zBuffer, height, width, p1, p2, p3, color);

          /*
          drawLine(
            frameBuffer32,
            height,
            width,
            Math.round(p1.x),
            Math.round(p1.y),
            Math.round(p2.x),
            Math.round(p2.y),
            color2
          );

          drawLine(
            frameBuffer32,
            height,
            width,
            Math.round(p2.x),
            Math.round(p2.y),
            Math.round(p3.x),
            Math.round(p3.y),
            color2
          );

          drawLine(
            frameBuffer32,
            height,
            width,
            Math.round(p3.x),
            Math.round(p3.y),
            Math.round(p1.x),
            Math.round(p1.y),
            color2
          );
          */
        }

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

        imageData.data.set(frameBuffer8);
        viewport.renderFrame(imageData, height, width);
      };

      const game = new EngineModule.Engine(inputs, gameLogic, renderer);

      window.addEventListener(
        "keydown",
        event => {
          if (event.which === 82) game.start(); // R
          if (event.which === 27) game.stop(); // Esc
        },
        false
      );
    });
  });
});