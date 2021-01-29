export class BaseGenerationFunction {
    calculateCurvePoint(offset) {
        return 1;
    }

    calculateColorAtPoint(offset) {
        return [0.5, 0.5, 0, 1];
    }

    generateBaseVertices(lod) {
        return [];
    }

    generateHeight() {
        return 0;
    }
}
