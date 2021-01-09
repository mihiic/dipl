import {SceneNode} from "../engine/scene-graph/scene-node.js";
import {LeafFunction} from "../plants/generation/functions/leaf-fn.js";
import {TyphaFunction} from "../plants/generation/functions/typha-fn.js";
import {Plant} from "../plants/plant.js";
import {Engine} from "../engine/engine.js";

export class Playground extends SceneNode {
    init() {
        super.init();

        this.plants = [];
        document.title = 'Foliage Simulation';
    }

    update(elapsed) {
        super.update(elapsed);
    }

    generatePlants(params) {
        const totalArea = params.areaWidth * params.areaDepth;
        const plantsNum = +totalArea * +params.density;

        for (let i = 0; i < plantsNum; i++) {
            const posX = Math.random() * params.areaWidth - params.areaWidth / 2;
            const posY = Math.random() * params.areaDepth - params.areaDepth / 2;

            const plant = new Plant();
            plant.setGenerationFunction(this.getGenerationFunction(params.plantType));
            if (params.plantHeight) {
                plant.setHeight(+params.plantHeight);
            }
            plant.setLod(+params.lod);
            plant.setPosition([posX, -1.5, posY]);
            plant.init();

            plant.enablePhysics();
            this.plants.push(plant);
        }

        for (const plant of this.plants) {
            this.addChild(plant);
        }

        this.setCamera(params);
    }

    getGenerationFunction(fn) {
        const plants = [new LeafFunction(), new TyphaFunction()];
        if (fn === 'Random' || fn === 'Grass') {
            return plants[Math.floor(Math.random() * plants.length)];
        }

        switch (fn) {
            case 'Typha':
                return new TyphaFunction();
            case 'Leaf':
                return new LeafFunction();
        }
    }

    simulateWind(params) {

    }

    setCamera(params) {
        const totalArea = +params.areaWidth * +params.areaDepth;

        this.camera = Engine.instance().camera;
        this.camera.setPosition([0, Math.sqrt(Math.sqrt(totalArea)) + 1, +params.areaDepth + 2]);
        this.camera.setTarget([0, 0, 0]);
    }
}
