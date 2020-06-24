import { prefix } from "../utils";
import { hasClass } from "@daybrush/utils";

export function directionCondition(e: any) {
    if (e.isRequest && (e.requestAble === "resizable" || e.requestAble === "scalable")) {
        return e.parentDirection!!;
    }
    return hasClass(e.inputEvent.target, prefix("direction"));
}
