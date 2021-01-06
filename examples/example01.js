import {SceneNode} from "../engine/scene-graph/scene-node.js";
import {Plant} from "../plants/plant.js";
import {LeafFunction} from "../plants/generation/functions/leaf-fn.js";
import {TyphaFunction} from "../plants/generation/functions/typha-fn.js";
import {Engine} from "../engine/engine.js";

export class Example01 extends SceneNode {
    init() {
        super.init();

        this.models = [];
        this.time = 0;

        document.title = 'Different LOD Generation';

        for (let i = 0; i < 4; i++) {
            const leafModel = new Plant();
            leafModel.setGenerationFunction(new LeafFunction());
            leafModel.setPosition([i - 2 + 0.5, -1.5, 0.5]);
            leafModel.setLod(i * 4 + 4);
            leafModel.init();

            this.models.push(leafModel);
        }

        for (let i = 0; i < 4; i++) {
            const typhaModel = new Plant();
            typhaModel.setGenerationFunction(new TyphaFunction());
            typhaModel.setPosition([i - 2 + 0.5, -1.5, -0.5]);
            typhaModel.setLod(i * 6 + 4);
            typhaModel.init();

            this.models.push(typhaModel);
        }

        for (const model of this.models) {
            this.addChild(model);
        }

        this.camera = Engine.instance().camera;
        this.camera.setPosition([0, 1.5, 4]);
        this.camera.setTarget([0, 0, 0]);
    }

    update(elapsed) {
        super.update(elapsed);

        this.time += elapsed * 0.2;
        // this.circleCamera();
    }

    circleCamera() {
        this.camera.setPosition([Math.cos(this.time) * 4, 1.5, Math.sin(this.time) * 4]);
        this.camera.setTarget([0, 0, 0]);
    }
}
