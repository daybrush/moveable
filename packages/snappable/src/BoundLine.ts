import { SnappableLine } from "./types";
import { solveConstantsOffset, solveLineConstants } from "./utils";


export class BoundLine {
    private _constants!: [number, number, number];
    constructor(public type: "up" | "down", public line: SnappableLine) {}
    public get a() {
        return this[0];
    }
    public get b() {
        return this[1];
    }
    public get c() {
        return this[2];
    }
    public get slope() {
        return -this.a / this.b;
    }
    public get 0() {
        return this.constants[0];
    }
    public get 1() {
        return this.constants[1];
    }
    public get 2() {
        return this.constants[2];
    }
    public get constants() {
        if (!this._constants) {
            this._constants = solveLineConstants(this.line);
        }
        return this._constants;
    }
    public getOffset(pos: number[]) {
        return solveConstantsOffset(this.constants, pos);
    }
}
