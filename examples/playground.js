import {SceneNode} from "../engine/scene-graph/scene-node.js";

export class Playground extends SceneNode {
    init() {
        super.init();

        document.title = 'Foliage Simulation';
    }

    update(elapsed) {
        super.update(elapsed);
    }
}
