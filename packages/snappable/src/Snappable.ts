import { BoundLine } from "./BoundLine";
import { SnappableBoundLine, SnappableLine } from "./types";
import { groupBy, solveConstantsOffset, solveLineConstants } from "./utils";

export class Snappable {
    private _snaps: SnappableLine[] = [];
    private _bounds: BoundLine[] = [];
    private _innerBounds: SnappableLine[] = [];
    constructor() {

    }
    public move(lines: SnappableLine[], dist: number[]) {

    }
    private _checkBounds(lines: SnappableLine[]) {
        const bounds = this._bounds;


        groupBy(bounds, boundLine => boundLine.slope).forEach(boundLines => {
            boundLines.forEach(boundLine => {
                const type = boundLine.type;
                const isIncrease = type === "up"

                lines.forEach(line => {
                    [line.point1, line.point2].forEach(point => {
                        const offset = boundLine.getOffset(point);
                    });
                });
            });
        });
    }
}
