import {Camera3D} from "./engine/rendering/camera.js";
import {Engine} from "./engine/engine.js";
import {Example01} from "./examples/example01.js";
import {Example02} from "./examples/example02.js";
import {Example03} from "./examples/example03.js";
import {Playground} from "./examples/playground.js";

const simulationParams = {
    type: 'wind-single'
};

function main() {
    const engine = Engine.instance();
    engine.initialize(
        '#main-canvas',
        [window.innerWidth - 300, window.innerHeight - 50],
        60, false, true,
        [1, 1, 1, 0]
    );

    advancedExample();
}

function advancedExample() {
    const engine = Engine.instance();
    engine.initializePhysicsWorld();

    const aspect = (window.innerWidth - 300) / (window.innerHeight - 50);

    const camera = new Camera3D(Math.PI / 3, aspect, 1, 1000);
    camera.setPosition([0, 0, 4]);
    camera.setTarget([0, 0, 0]);

    engine.setMainCamera(camera);

    const root = new Example01();
    root.init();

    engine.setRootScene(root);

    setGeneration();
}

function setSimulation() {
    resetClasses();
    setActive('simulation');
}

function setGeneration() {
    resetClasses();
    setActive('generation');
}

function resetClasses() {
    const elements = document.getElementsByClassName('toggle-item');
    for (const el of elements) {
        el.className = 'toggle-item';
    }

    let form = document.getElementById('generation-form');
    form.style.display = 'none';

    form = document.getElementById('simulation-form');
    form.style.display = 'none';
}

function setActive(id) {
    const active = document.getElementById(id);
    active.className = 'toggle-item toggle-item-active';

    const form = document.getElementById(id + '-form');
    form.style.display = 'block';
}

function generate() {
    const engine = Engine.instance();
    engine.initializePhysicsWorld();

    const root = new Playground();
    root.init();

    root.generatePlants(getGenerationParams());
    engine.setRootScene(root);

    this.setSimulation();
}

function simulate() {
    const engine = Engine.instance();
    const scene = engine.root;
    scene.simulateWind(getWindParams());
}

function setWindType(type) {
    const elements = document.getElementsByClassName('wind-type');
    for (const el of elements) {
        el.className = 'wind-type';
        if (el.id === type) {
            el.className = 'wind-type wind-type-active';
        }
    }

    simulationParams.type = type;
}

function getGenerationParams() {
    const params = {};
    const keys = ['areaWidth', 'areaDepth', 'density', 'lod', 'plantType', 'plantHeight', 'elasticity'];

    for (const key of keys) {
        const el = document.getElementById(key);
        params[key] = el.value;
    }

    return params;
}

function getWindParams() {
    const params = {};
    const keys = ['windStrength', 'windDirection', 'windFrequency'];

    for (const key of keys) {
        const el = document.getElementById(key);
        params[key] = +el.value;
    }

    params['windType'] = simulationParams.type;
    return params;
}

main();

// exports
window.foliage = {};
window.foliage.setSimulation = setSimulation;
window.foliage.setGeneration = setGeneration;
window.foliage.generate = generate;
window.foliage.simulate = simulate;

window.foliage.setWindType = setWindType;
