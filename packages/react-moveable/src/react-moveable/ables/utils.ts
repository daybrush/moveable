import { prefix } from "../utils";
import { hasClass, IObject } from "@daybrush/utils";
import { InvertTypes } from "../types";

export function directionCondition(e: any) {
    if (e.isRequest) {
        if (e.requestAble === "resizable" || e.requestAble === "scalable") {
            return e.parentDirection!;
        } else {
            return false;
        }
    }
    return hasClass(e.inputEvent.target, prefix("direction"));
}

// MatchTypes<typeof Draggable["props"], AnyProps<DraggableOptions>>;
// MatchTypes<typeof Resizable["events"], DraggableEvents>;
export function invert<T extends IObject<any>>(obj: T): InvertTypes<T> {
    const nextObj: IObject<any> = {};

    for (const name in obj) {
        nextObj[obj[name]] = name;
    }
    return nextObj as any;
}
