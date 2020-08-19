import { prefix } from "../utils";
import { hasClass, IObject } from "@daybrush/utils";
import { InvertTypes } from "../types";
import { parse, toMat } from "css-to-mat";

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

export function invert<T extends IObject<any>>(obj: T): InvertTypes<T> {
    const nextObj: IObject<any> = {};

    for (const name in obj) {
        nextObj[obj[name]] = name;
    }
    return nextObj as any;
}

export function getTransform(transforms: string[], index: number) {
    const beforeFunctionTexts = transforms.slice(0, index < 0 ? undefined : index);
    const targetFunctionText = transforms[index] || "";
    const afterFunctionTexts = index < 0 ? [] : transforms.slice(index);
    const beforeFunctions = parse(beforeFunctionTexts);
    const targetFunctions = parse([targetFunctionText]);
    const afterFunctions = parse(afterFunctionTexts);

    return {
        transforms,
        beforeFunctionMatrix: toMat(beforeFunctions),
        targetFunctionMatrix: toMat(targetFunctions),
        afterFunctionMatrix: toMat(afterFunctions),
        beforeFunctions,
        targetFunction: targetFunctions[0],
        afterFunctions,
        beforeFunctionTexts,
        targetFunctionText,
        afterFunctionTexts,
    };
}
