export interface MoveableState {
    target: HTMLElement | null | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    matrix: number[];
    transform: string;
    transformOrigin: number[];
    origin: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}

export interface OnRotate {
    delta: number;
    dist: number;
    matrix: string;
}
