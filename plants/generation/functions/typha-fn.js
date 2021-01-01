import {BaseGenerationFunction} from "../base-generation-function.js";

export class TyphaFunction extends BaseGenerationFunction {
    calculateCurvePoint(offset) {
        if (offset < 0.7) {
            return 0.1;
        }
        if (offset > 0.98) {
            return 0;
        }

        return 0.5;
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
        return 1.2 + Math.random() * 1.5;
    }
}
