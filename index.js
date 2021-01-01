import {Camera3D} from "./engine/rendering/camera.js";
import {Engine} from "./engine/engine.js";
import {BasePlant} from "./plants/base-plant.js";

function main() {
    const engine = Engine.instance();
    engine.initialize(
        '#main-canvas',
        [600, 600],
        60, true, true,
        [0.85, 0.85, 0.85, 1]
    );

    advancedExample();
}

function advancedExample() {
    const engine = Engine.instance();

    const camera = new Camera3D(Math.PI / 3, 1, 1, 1000);
    camera.setPosition([0, 1.5, 3]);
    camera.setTarget([0, 0, 0]);

    engine.setMainCamera(camera);

    const model = new BasePlant();
    model.init();

    engine.setRootScene(model);
}

main();
