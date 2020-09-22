window.addEventListener("DOMContentLoaded", async function() {
  const Engine = await import("./core/Engine.js");
  const Game = await import("./game/GameModule.js");

  const oldHouseTextureData = await Game.FileLoader.loadImage(
    "../src/assets/old-house/old-house-texture.jpg"
  );

  const oldHouseNormalData = await Game.FileLoader.loadImage(
    "../src/assets/old-house/old-house-normals.jpg"
  );

  const file = await Game.FileLoader.loadObjectFile(
    "../src/assets/old-house/old-house.obj"
  );

  const character = new Game.Character(0, 0, 6);
  const landscape = file;// new Game.Landscape(-8, 0, -8, 16, 16);

  const inputs = () => {};
  const gameLogic = () => {};

  function renderer(viewport) {
    const tranform = character.camera.getTransformation();
    const meshFacesCount = landscape.mesh.getLength();
    const frame = new Engine.Frame(viewport.width, viewport.height);

    let
      p1i, p2i, p3i,
      uv1i, uv2i, uv3i,
      p1, p2, p3,
      uv1, uv2, uv3;

    for (let i = 0; i < meshFacesCount; i += 3) {
      p1i = landscape.mesh.map[i] * 3;
      p2i = landscape.mesh.map[i + 1] * 3;
      p3i = landscape.mesh.map[i + 2] * 3;

      uv1i = landscape.uv.map[i] * 2;
      uv2i = landscape.uv.map[i + 1] * 2;
      uv3i = landscape.uv.map[i + 2] * 2;

      p1 = new Engine.Point3(
        landscape.mesh.coordinates[p1i] + landscape.getX(),
        landscape.mesh.coordinates[p1i + 1] + landscape.getY(),
        landscape.mesh.coordinates[p1i + 2] + landscape.getZ()
      );

      p2 = new Engine.Point3(
        landscape.mesh.coordinates[p2i] + landscape.getX(),
        landscape.mesh.coordinates[p2i + 1] + landscape.getY(),
        landscape.mesh.coordinates[p2i + 2] + landscape.getZ()
      );

      p3 = new Engine.Point3(
        landscape.mesh.coordinates[p3i] + landscape.getX(),
        landscape.mesh.coordinates[p3i + 1] + landscape.getY(),
        landscape.mesh.coordinates[p3i + 2] + landscape.getZ()
      );

      uv1 = new Engine.Point2(
        landscape.uv.coordinates[uv1i],
        landscape.uv.coordinates[uv1i + 1]
      );

      uv2 = new Engine.Point2(
        landscape.uv.coordinates[uv2i],
        landscape.uv.coordinates[uv2i + 1]
      );

      uv3 = new Engine.Point2(
        landscape.uv.coordinates[uv3i],
        landscape.uv.coordinates[uv3i + 1]
      );

      frame.renderPoly(
        new Engine.Polygon(
          p1, p2, p3,
          uv1, uv2, uv3,
          oldHouseTextureData
        ),
        tranform
      );
    }

    viewport.renderFrame(frame.getData(), viewport.height, viewport.width);
  }

  const game = new Engine.Engine(inputs, gameLogic, renderer);

  window.addEventListener(
    "keydown",
    event => {
      if (event.which === 82) game.start(); // R
      if (event.which === 27) game.stop(); // Esc
    },
    false
  );
});