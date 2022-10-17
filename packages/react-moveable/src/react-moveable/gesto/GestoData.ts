import { MoveableManagerInterface } from "../types";

export function getGestoData(moveable: MoveableManagerInterface, ableName: string) {
    const targetGesto = moveable.targetGesto;
    const controlGesto = moveable.controlGesto;
    let data!: Record<string, any>;

    if (targetGesto?.isFlag()) {
        data = targetGesto.getEventData()[ableName];
    }

    if (!data && controlGesto?.isFlag()) {
        data = controlGesto.getEventData()[ableName];
    }

    return data || {};
}
