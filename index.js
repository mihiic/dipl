import {Camera3D} from "./engine/rendering/camera.js";
import {Engine} from "./engine/engine.js";
import {Example01} from "./examples/example01.js";
import {Example02} from "./examples/example02.js";
import {Example03} from "./examples/example03.js";

function main() {
    const engine = Engine.instance();
    engine.initialize(
        '#main-canvas',
        [600, 600],
        60, false, true,
        [0.85, 0.85, 0.85, 1]
    );

    advancedExample();
}

function advancedExample() {
    const engine = Engine.instance();
    engine.initializePhysicsWorld();

    const camera = new Camera3D(Math.PI / 3, 1, 1, 1000);
    camera.setPosition([0, 0, 4]);
    camera.setTarget([0, 0, 0]);

    engine.setMainCamera(camera);

    const root = new Example01();
    root.init();

    engine.setRootScene(root);
}

main();
