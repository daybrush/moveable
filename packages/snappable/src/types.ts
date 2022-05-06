export interface SnappableOptions {

}

export interface SnappableLine {
    point1: number[];
    point2: number[];
}

export interface SnappableBoundLine extends SnappableLine {
    /**
     * "up" if above or to the left of the line's slope,
     * "down" if below or to the right of the line
     */
    type: "up" | "down";
}
