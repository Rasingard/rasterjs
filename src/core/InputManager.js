export default class InputManager {
  constructor() {
    const _pressedKeys = {};
    const _keysActivationTime = {};

    const _disableEvent = e => {
      if (e.stopPropagation) e.stopPropagation();
      else if (window.event) window.event.cancelBubble = true;

      e.preventDefault();
      return false;
    };

    // KEYS //
    //////////
    window.addEventListener(
      "keydown",
      event => {
        if (!_pressedKeys[event.code]) {
          _pressedKeys[event.code] = true;
          _keysActivationTime[event.code] = Date.now();
        }
        _disableEvent(event);
      },
      false
    );

    window.addEventListener(
      "keyup",
      event => {
        _pressedKeys[event.code] = false;
        _keysActivationTime[event.code] =
          Date.now() - _keysActivationTime[event.code];
        _disableEvent(event);
      },
      false
    );

    // MOUSE //
    ///////////
    window.addEventListener(
      "mousedown",
      event => {
        if (!_pressedKeys[`mouse${event.button}`]) {
          _pressedKeys[`mouse${event.button}`] = true;
          _keysActivationTime[`mouse${event.button}`] = Date.now();
        }
        _disableEvent(event);
      },
      false
    );

    window.addEventListener(
      "mouseup",
      event => {
        _pressedKeys[`mouse${event.button}`] = false;
        _keysActivationTime[`mouse${event.button}`] =
          Date.now() - _keysActivationTime[`mouse${event.button}`];
        _disableEvent(event);
      },
      false
    );

    // WHEELLs //
    /////////////
    window.addEventListener(
      "wheel",
      event => {
        _pressedKeys[`mouseWheelUp`] = event.deltaY > 0;
        _pressedKeys[`mouseWheelDown`] = event.deltaY < 0;
      },
      false
    );

    // GET //
    /////////
    this.keyPressed = name => {
      let duration;

      if (_pressedKeys[name]) {
        duration = Date.now() - _keysActivationTime[name];
        _keysActivationTime[name] = Date.now();
      } else {
        duration = _keysActivationTime[name];
        _keysActivationTime[name] = 0;
      }

      return duration;
    };

    this.keyActive = name => {
      if (_pressedKeys[name]) return true;
      else return false;
    };

    // SET //
    /////////
    this.wheelRelease = () => {
      _pressedKeys[`mouseWheelUp`] = false;
      _pressedKeys[`mouseWheelDown`] = false;
    };
  }
}
