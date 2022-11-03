import { minus } from "@scena/matrix";
import { MoveableManagerState, PersistRectData } from "../types";


export function getPersistState(rect: PersistRectData): Partial<MoveableManagerState> {

    const beforeOrigin = minus(rect.origin, [rect.left, rect.top]);
    return {
        ...rect,
        beforeOrigin,
        origin: beforeOrigin,
        isPersisted: true,
    };
}
