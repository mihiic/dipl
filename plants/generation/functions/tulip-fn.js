import {BaseGenerationFunction} from "../base-generation-function.js";

export class TulipFunction extends BaseGenerationFunction {
    calculateCurvePoint(offset) {
        if (offset < 0.75) {
            return 0.1;
        }

        const flowerOffset = (offset - 0.75) / 0.3 * Math.PI;
        return 0.5 + Math.sin(flowerOffset) / 3;
    }

    getBaseShape(lod) {
        if (!lod || lod < 4) {
            lod = 4;
        }

        const vertices = [];
        let i = 0;
        while (i < lod) {
            const offset = i / lod;
            vertices.push(
                [-Math.cos(offset * Math.PI * 2) * 0.3, 0, Math.sin(offset * Math.PI * 2) * 0.3]
            );
            i++;
        }

        return vertices;
    }


    generateHeight() {
        return 1.2;
    }

    calculateColorAtPoint(offset) {
        if (offset < 0.75) {
            return [0.2, 0.85, 0.2, 1];
        }

        return [0.8, 0.1, 0.1, 1];
    }
}
