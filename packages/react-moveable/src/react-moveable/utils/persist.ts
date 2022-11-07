import { minus } from "@scena/matrix";
import { MoveableManagerState, PersistRectData } from "../types";


export function getPersistState(rect: PersistRectData): Partial<MoveableManagerState> {

    const origin = minus(rect.origin, [rect.left, rect.top]);
    return {
        ...rect,
        beforeOrigin: origin,
        // originalBeforeOrigin: origin,
        origin,
        isPersisted: true,
    };
}
