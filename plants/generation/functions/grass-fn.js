import {BaseGenerationFunction} from "../base-generation-function.js";

export class GrassFunction extends BaseGenerationFunction {
    calculateCurvePoint(offset) {
        return 0.5 - 0.5 * offset;
    }

    getBaseShape(lod) {
        return [
            [0, 0, -0.1],
            [-0.2, 0, 0],
            [0, 0, 0.1],
            [0.2, 0, 0]
        ];
    }

    generateHeight() {
        return 0.5 + Math.random() / 2;
    }
}
