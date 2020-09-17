const RENDER_SCALE = 1.0; // %
const TARGET_FPS = 60;
const CAMERA_SPEED = 1; // units/s
const ROTATION_SPEED = 6; // angle/s
const RENDER_DISTANCE = 16; // units
const CAMERA_FOV = 90;
const ADAPTATIVE_RESOLUTION = true;
// const FOG_COLOR = new Color(0, 0, 0); // new Color(132, 235, 255);
// const SUN_COLOR = new Color(175, 175, 255).blend(Color.black, 0.85);
const FOG_DISTANCE = 4;
const AMB_LIGHT_INTENSITY = 0.6;
const CHUNCK_SIZE = 16;
const RASTER_DISTANCE = 32;
let MAX_POLY_COUNT = 2000;

// INIT
const FOG_MIN_DISTANCE = RENDER_DISTANCE - FOG_DISTANCE;
const SHADOW_DISTANCE = RENDER_DISTANCE / 2;
const SHADOW_RENDER_DISTANCE = SHADOW_DISTANCE;
const LIGHT_RENDER_DISTANCE = RENDER_DISTANCE;

/*
const FakeLightDir = Vector.fromCoords(0, 0, 0, 1, -1, 1).normalize();
const FakeLightDir2 = FakeLightDir.getInverse();
const FakeLightColor = new Color(255, 255, 255);
const FakeLightColor2 = new Color(255, 50, 50);
*/
