export function solveConstantsDistance(
    [a, b, c]: [number, number, number],
    pos: number[],
) {
    return (a * pos[0] + b * pos[1] + c) / Math.sqrt(a * a + b * b);
}
export function solveC(
    [a, b]: [number, number],
    pos: number[],
) {
    // ax + by + c = 0
    // -ax -by;
    return -a * pos[0] - b * pos[1];
}
