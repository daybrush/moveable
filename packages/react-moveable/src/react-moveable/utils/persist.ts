import { minus } from "@scena/matrix";
import { getMinMaxs } from "overlap-area";
import { MoveableManagerState, PersistRectData } from "../types";


export function getPersistState(rect: PersistRectData): Partial<MoveableManagerState> | null {
    let {
        pos1,
        pos2,
        pos3,
        pos4,
    } = rect;
    if (!pos1 || !pos2 || !pos3 || !pos4) {
        return null;
    }
    const minPos = getMinMaxs([pos1!, pos2!, pos3!, pos4!]);
    const posDelta = [minPos.minX, minPos.minY];
    const origin = minus(rect.origin, posDelta);

    pos1 = minus(pos1, posDelta);
    pos2 = minus(pos2, posDelta);
    pos3 = minus(pos3, posDelta);
    pos4 = minus(pos4, posDelta);
    return {
        ...rect,
        left: rect.left,
        top: rect.top,
        posDelta,
        pos1,
        pos2,
        pos3,
        pos4,
        origin,
        beforeOrigin: origin,
        // originalBeforeOrigin: origin,
        isPersisted: true,
    };
}
