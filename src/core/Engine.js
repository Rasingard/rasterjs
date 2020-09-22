import Point3 from "./point/Point3";
import Point2 from "./point/Point2";
import Vector3 from "./vector/Vector3";
import Vector2 from "./vector/Vector2";
import Quaternion from "./Quaternion";
import Matrix4 from "./matrix/Matrix4";
import EventsController from "./EventsController";
import InputManager from "./InputManager";
import Object3 from "./object3/Object3";
import Viewport from "./Viewport";
import Color from "./Color";
import Frame from "./Frame";
import Polygon from "./Polygon";

const _inputManager = new InputManager();
const _eventsController = new EventsController();
const _viewport = new Viewport();
Object3.prototype.EventsController = _eventsController;

class Engine {
  constructor(inputs, gameLogic, render) {
    inputs.EventsController = _eventsController;
    gameLogic.EventsController = _eventsController;
    render.EventsController = _eventsController;

    let _start = null;
    let _time = 0;
    let _gameTime = 0;
    let _frameRequestID = null;
    let _lastFrameTime = 0;
    let _frameTime = 0;

    const debuggFTime = document.getElementById("FRAME-TIME");
    const debuggFPS = document.getElementById("FPS");
    const debuggTIME = document.getElementById("TIME");

    const gameLoop = timestamp => {
      if (!_start) _start = timestamp;
      _time = _gameTime + (timestamp - _start);

      try {
        _eventsController.emit("inputphase", _inputManager);
        render(_viewport);
      } catch (err) {
        console.log(err);
        debugger;
      }

      debuggFTime.innerHTML = _frameTime.toFixed(2);
      debuggFPS.innerHTML = Math.round(1000 / _frameTime);
      debuggTIME.innerHTML = Math.round(_time);

      _frameTime = timestamp - _lastFrameTime;
      _lastFrameTime = timestamp;
      _frameRequestID = window.requestAnimationFrame(gameLoop);
    };

    this.start = () => {
      _frameRequestID = window.requestAnimationFrame(gameLoop);
    };

    this.stop = () => {
      window.cancelAnimationFrame(_frameRequestID);
      _start = null;
      _gameTime = _time;
    };
  }
}

export {
  Point3,
  Point2,
  Vector3,
  Vector2,
  Quaternion,
  Matrix4,
  Object3,
  Engine,
  Color,
  Frame,
  Polygon
};
