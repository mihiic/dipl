import {SceneNode} from "../engine/scene-graph/scene-node.js";
import {LeafFunction} from "../plants/generation/functions/leaf-fn.js";
import {TyphaFunction} from "../plants/generation/functions/typha-fn.js";
import {Plant} from "../plants/plant.js";
import {Engine} from "../engine/engine.js";
import {GrassFunction} from "../plants/generation/functions/grass-fn.js";

export class Playground extends SceneNode {
    init() {
        super.init();

        this.plants = [];
        this.windSimulation = {
            type: null,
            elapsed: 0,
            params: null,
            fn: null
        };

        document.title = 'Foliage Simulation';
    }

    update(elapsed) {
        super.update(elapsed);

        if (!this.windSimulation.type) {
            return;
        }

        this.windSimulation.elapsed += elapsed;
        this.getSimulationFunction(this.windSimulation.params.windType)
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
            // plant.setWind(30, 1);
            this.addChild(plant);
        }

        this.setCamera(params);
    }

    getGenerationFunction(fn) {
        const plants = [new LeafFunction(), new TyphaFunction(), new GrassFunction()];
        if (fn === 'Random') {
            return plants[Math.floor(Math.random() * plants.length)];
        }

        switch (fn) {
            case 'Typha':
                return new TyphaFunction();
            case 'Leaf':
                return new LeafFunction();
            case 'Grass':
                return new GrassFunction();
            default:
                return plants[Math.floor(Math.random() * plants.length)];
        }


    }

    simulateWind(params) {
        this.windSimulation.elapsed = 0;
        this.windSimulation.type = params.windType;
        this.windSimulation.params = params;

        for (const plant of this.plants) {
            plant.setWind(0, 0);
        }
    }

    singleSimulation() {
        if (this.windSimulation.elapsed > 0.2) {
            for (const plant of this.plants) {
                plant.setWind(0, 0);
            }
            return;
        }

        for (const plant of this.plants) {
            plant.setWind(
                this.windSimulation.params.windDirection,
                this.windSimulation.params.windStrength
            );
        }
    }

    onAndOffSimulation() {
        if (!this.windSimulation.params.cycleTime) {
            this.windSimulation.params.cycleTime = 1 / this.windSimulation.params.windFrequency;
            this.windSimulation.params.lastTime = 0;
            this.windSimulation.params.currentCycle = true;
            this.windSimulation.params.currentCycleTime = 0;
        }

        const elapsed = this.windSimulation.elapsed - this.windSimulation.params.lastTime;
        this.windSimulation.params.lastTime = this.windSimulation.elapsed;

        this.windSimulation.params.currentCycleTime += elapsed;
        if (this.windSimulation.params.currentCycleTime > this.windSimulation.params.cycleTime) {
            this.windSimulation.params.currentCycleTime = 0;
            this.windSimulation.params.currentCycle = !this.windSimulation.params.currentCycle;
        }

        for (const plant of this.plants) {
            plant.setWind(
                this.windSimulation.params.windDirection,
                this.windSimulation.params.currentCycle ? this.windSimulation.params.windStrength : 0
            );
        }
    }

    waveSimulation() {
        const factor = Math.PI * this.windSimulation.params.windFrequency;

        for (const plant of this.plants) {
            plant.setWind(
                this.windSimulation.params.windDirection,
                (1 + Math.sin(this.windSimulation.elapsed * factor)) * this.windSimulation.params.windStrength / 2
            );
        }
    }

    steadySimulation() {
        for (const plant of this.plants) {
            plant.setWind(
                this.windSimulation.params.windDirection,
                this.windSimulation.params.windStrength
            );
        }
    }

    getSimulationFunction(windType) {
        switch (windType) {
            case 'wind-single':
                this.singleSimulation();
                break;
            case 'wind-steady':
                this.steadySimulation();
                break;
            case 'wind-on-off':
                this.onAndOffSimulation();
                break;
            case 'wind-wave':
                this.waveSimulation();
                break;
        }
    }

    setCamera(params) {
        const totalArea = +params.areaWidth * +params.areaDepth;

        this.camera = Engine.instance().camera;
        this.camera.setPosition([0, Math.sqrt(Math.sqrt(totalArea)) + 1, +params.areaDepth + 2]);
        this.camera.setTarget([0, 0, 0]);
    }
}
