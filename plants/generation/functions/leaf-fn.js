import {BaseGenerationFunction} from "../base-generation-function.js";

export class LeafFunction extends BaseGenerationFunction {
    calculateCurvePoint(offset) {
        return Math.sin(offset * Math.PI);
    }

    getBaseShape(lod) {
        return [
            [0, 0, -0.1],
            [-0.3, 0, 0],
            [0, 0, -0.05],
            [0.3, 0, 0]
        ];
    }

    generateHeight() {
        return 0.5 + Math.random();
    }

    calculateColorAtPoint(offset) {
        return [0.2, 0.85, 0.2, 1];
    }
}
