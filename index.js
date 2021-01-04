import {Camera3D} from "./engine/rendering/camera.js";
import {Engine} from "./engine/engine.js";
import {Plant} from "./plants/plant.js";
import {TyphaFunction} from "./plants/generation/functions/typha-fn.js";
import {SceneNode} from "./engine/scene-graph/scene-node.js";

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
    camera.setPosition([0, 1.5, 3]);
    camera.setTarget([0, 0, 0]);

    engine.setMainCamera(camera);

    const model = new Plant();
    model.setGenerationFunction(new TyphaFunction());
    model.setPosition([0, -1, 0]);
    model.setLod(15);
    model.init();

    model.enablePhysics();

    const root = new SceneNode();
    root.addChild(model);

    engine.setRootScene(root);
}

main();
