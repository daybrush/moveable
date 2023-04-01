import { Able } from "./types";
import { InitialMoveable } from "./InitialMoveable";

export function makeMoveable<T extends Record<string, any> = {}>(
    ables: Array<Able<T>>,
): typeof InitialMoveable & (new (...args: any[]) => InitialMoveable<T>) {
    return class Moveable extends InitialMoveable<T> {
        public static defaultAbles = ables;
    };
}
