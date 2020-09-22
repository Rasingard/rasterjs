import GameObject from "./GameObject";
import Quaternion from "../core/Quaternion";
import Vector3 from "../core/vector/Vector3";
import Camera from "./Camera";

export default class Character extends GameObject {
  constructor(x, y, z) {
    super(x, y, z);
    this.camera = new Camera(this.x, this.y + 1, this.z);
    this.rotationSpeed = 6 / 100;
    this.baseSpeed = 1 / 200;

    // Fix Y overlap
    /*
    const xRotation = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), 33);
    const rotationM4 = xRotation.rotationM4(this.get());
    const cameraLocation = this.camera.get();
    rotationM4.transform3D(cameraLocation);
    this.camera.setC(cameraLocation);
    this.camera.quaternionRotation(xRotation);
    */

    const xQuat = Quaternion.fromAxisAngle(Vector3.RIGHT, 270);
    this.camera.quaternionRotation(xQuat);

    this.init();
  }

  init() {
    this.EventsController.on("inputphase", inputManager => {
      let xDelta = 0;
      let yDelta = 0;
      let zDelta = 0;

      const xMoviment = inputManager.keyPressed("KeyD") - inputManager.keyPressed("KeyA");
      // if (xMoviment) xDelta += xMoviment * this.baseSpeed; // GLOBAL MOVEMENT

      if (xMoviment) { // LOCAL MOVEMENT
        xDelta += this.camera.xAxis.x * xMoviment * this.baseSpeed;
        yDelta += this.camera.xAxis.y * xMoviment * this.baseSpeed;
        zDelta += this.camera.xAxis.z * xMoviment * this.baseSpeed;
      }

      const zMoviment = inputManager.keyPressed("KeyW") - inputManager.keyPressed("KeyS");
      // if (zMoviment) zDelta -=  zMoviment * this.baseSpeed; // GLOBAL MOVEMENT

      if (zMoviment) { // LOCAL MOVEMENT
        const lockY = new Vector3(this.camera.zAxis.x, 0, this.camera.zAxis.z);
        lockY.normalize();
        xDelta += lockY.x * zMoviment * this.baseSpeed;
        yDelta += lockY.y * zMoviment * this.baseSpeed;
        zDelta += lockY.z * zMoviment * this.baseSpeed;
      }


      const xRotation = inputManager.keyPressed("ArrowDown") - inputManager.keyPressed("ArrowUp"); // INVERTED ROTATION (CAMERA POINTING -Z)
      if(xRotation) {
        const xQuat = Quaternion.fromAxisAngle(this.camera.xAxis, xRotation * this.rotationSpeed);
        this.camera.quaternionRotation(xQuat);
      }

      const zRotation = inputManager.keyPressed("ArrowRight") - inputManager.keyPressed("ArrowLeft"); // INVERTED ROTATION (CAMERA POINTING -Z)
      if(zRotation) {
        const zQuat = Quaternion.fromAxisAngle(Vector3.UP, zRotation * this.rotationSpeed);
        this.camera.quaternionRotation(zQuat);
      }

      //

      /* Move up & down*/
      const yMoviment =
        inputManager.keyPressed("Space") -
        inputManager.keyPressed("ControlLeft");

      if (yMoviment) {
        yDelta += this.baseSpeed * yMoviment;
        yDelta += this.baseSpeed * yMoviment;
      }

      this.x += xDelta;
      this.y += yDelta;
      this.z += zDelta;

      this.camera.x += xDelta;
      this.camera.y += yDelta;
      this.camera.z += zDelta;

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
