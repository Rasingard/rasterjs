import GameObject from "./GameObject";
import Quaternion from "../core/Quaternion";
import Vector3 from "../core/vector/Vector3";
import Camera from "./Camera";

export default class Character extends GameObject {
  constructor(x, y, z) {
    super(x, y, z);
    this.camera = new Camera(this.x, this.y + 10, this.z);
    this.rotationSpeed = 6 / 100;
    this.baseSpeed = 1 / 200;

    // Fix Y overlap
    const xRotation = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), 33);
    const rotationM4 = xRotation.rotationM4(this.get());
    const cameraLocation = this.camera.get();
    rotationM4.transform3D(cameraLocation);
    this.camera.setC(cameraLocation);
    this.camera.quaternionRotation(xRotation);

    this.init();
  }

  init() {
    this.EventsController.on("inputphase", inputManager => {
      let xVariation = 0;
      let yVariation = 0;
      let zVariation = 0;

      const xMoviment =
        inputManager.keyPressed("KeyD") - inputManager.keyPressed("KeyA");

      if (xMoviment) xVariation += xMoviment * this.baseSpeed;
      /*
      if (xMoviment) {
        xVariation += this.camera.xAxis.x * xMoviment * this.baseSpeed;
        yVariation += this.camera.xAxis.y * xMoviment * this.baseSpeed;
        zVariation += this.camera.xAxis.z * xMoviment * this.baseSpeed;
      }
      */

      const zMoviment =
        inputManager.keyPressed("KeyW") - inputManager.keyPressed("KeyS");

      if (zMoviment) zVariation -= zMoviment * this.baseSpeed;
      /*
      if (zMoviment) {
        xVariation += this.camera.zAxis.x * zMoviment * this.baseSpeed;
        yVariation += this.camera.zAxis.y * zMoviment * this.baseSpeed;
        zVariation += this.camera.zAxis.z * zMoviment * this.baseSpeed;
      }
      */

      /* Move up & down
      const yMoviment =
        inputManager.keyPressed("Space") -
        inputManager.keyPressed("ControlLeft");

      if (yMoviment) {
        yVariation += this.baseSpeed * yMoviment;
        yVariation += this.baseSpeed * yMoviment;
      }
      */

      this.x += xVariation;
      this.y += yVariation;
      this.z += zVariation;

      this.camera.x += xVariation;
      this.camera.y += yVariation;
      this.camera.z += zVariation;

      /* Camera Rotation relative Character
      const xAxisRotation =
        inputManager.keyPressed("ArrowUp") -
        inputManager.keyPressed("ArrowDown");

      const yAxisRotation =
        inputManager.keyPressed("ArrowRight") -
        inputManager.keyPressed("ArrowLeft");

      if (xAxisRotation) {
        const xRotation = Quaternion.fromAxisAngle(
          this.camera.xAxis,
          xAxisRotation * this.rotationSpeed
        );

        const rotationM4 = xRotation.rotationM4(this.get());
        const cameraLocation = this.camera.get();
        rotationM4.transform3D(cameraLocation);

        if (cameraLocation.getY() > 10 && cameraLocation.getY() < 19) {
          this.camera.setC(cameraLocation);
          this.camera.quaternionRotation(xRotation);
        }
      }

      if (yAxisRotation) {
        const yRotation = Quaternion.fromAxisAngle(
          new Vector3(0, 1, 0),
          yAxisRotation * this.rotationSpeed
        );

        const rotationM4 = yRotation.rotationM4(this.get());
        const cameraLocation = this.camera.get();
        rotationM4.transform3D(cameraLocation);
        this.camera.setC(cameraLocation);
        this.camera.quaternionRotation(yRotation);
      }
      */

      /* Camera Rotation
      if (xAxisRotation)
        this.camera.quaternionRotation(
          Quaternion.fromAxisAngle(
            this.camera.xAxis,
            xAxisRotation * this.rotationSpeed
          )
        );
      */

      /*
      if (yAxisRotation)
        this.camera.quaternionRotation(
          Quaternion.fromAxisAngle(
            new Vector3(0, -1, 0),
            yAxisRotation * this.rotationSpeed
          )
        );
      */
    });
  }
}
