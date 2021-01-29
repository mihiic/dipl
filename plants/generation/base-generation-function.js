export class BaseGenerationFunction {
    calculateCurvePoint(offset) {
        return 1;
    }

    calculateColorAtPoint(offset) {
        return [0.2, 0.85, 0.2, 1];
    }

    generateBaseVertices(lod) {
        return [];
    }

    generateHeight() {
        return 0;
    }
}
