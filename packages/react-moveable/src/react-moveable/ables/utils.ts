import { prefix } from "../utils";
import { hasClass, IObject, splitBracket, splitComma, splitUnit } from "@daybrush/utils";
import { InvertTypes, MatrixInfo } from "../types";
import { createIdentityMatrix, convertCSStoMatrix, convertDimension } from "../matrix";
import { mat4 } from "gl-matrix";

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

export function stringToMatrixInfo(transforms: string[]): MatrixInfo[] {
    return transforms.map(transform => {
        const { prefix: name, value } = splitBracket(transform);

        let functionName: keyof typeof mat4 | "" = "";
        let functionValue: any = "";

        if (name === "translate" || name === "translateX" || name === "translate3d") {
            const [posX, posY = 0, posZ = 0] = splitComma(value!).map(v => parseFloat(v));

            functionName = "translate";
            functionValue = [posX, posY, posZ];
        } else if (name === "translateY") {
            const posY = parseFloat(value!);

            functionName = "translate";
            functionValue = [0, posY, 0];
        } else if (name === "translateZ") {
            const posZ = parseFloat(value!);

            functionName = "translate";
            functionValue = [0, 0, posZ];
        } else if (name === "scale" || name === "scale3d") {
            const [sx, sy = sx, sz = 1] = splitComma(value!).map(v => parseFloat(v)) as number[];

            functionName = "scale";
            functionValue = [sx, sy, sz];
        } else if (name === "scaleX") {
            const sx = parseFloat(value!);

            functionName = "scale";
            functionValue = [sx, 1, 1];
        } else if (name === "scaleY") {
            const sy = parseFloat(value!);

            functionName = "scale";
            functionValue = [1, sy, 1];
        } else if (name === "scaleZ") {
            const sz = parseFloat(value!);
            functionName = "scale";
            functionValue = [1, 1, sz];
        } else if (name === "rotate" || name === "rotateZ" || name === "rotateX" || name === "rotateY") {
            const { unit, value: unitValue } = splitUnit(value!);
            const rad = unit === "rad" ? unitValue : unitValue * Math.PI / 180;

            functionName = name === "rotate" ? "rotateZ" : name;
            functionValue = rad;
        } else if (name === "matrix3d") {
            functionName = "multiply";
            functionValue = splitComma(value!).map(v => parseFloat(v));
        } else if (name === "matrix") {
            const m = splitComma(value!).map(v => parseFloat(v));
            functionName = "multiply";
            functionValue = convertDimension(convertCSStoMatrix(m), 3, 4);
        }
        return {
            name: name!,
            value: value!,
            functionName,
            functionValue,
        };
    });
}

export function valueToMatrix(matrixInfos: MatrixInfo[]) {
    const target = createIdentityMatrix(4) as mat4;

    matrixInfos.forEach(info => {
        const {
            functionName,
            functionValue,
        } = info;

        if (!functionName) {
            return;
        }
        (mat4 as any)[functionName](target, target, functionValue);
    });
    return target;
}
export function getTransform(transforms: string[], index: number) {
    const beforeFunctionTexts = transforms.slice(0, index < 0 ? undefined : index);
    const targetFunctionText = transforms[index] || "";
    const afterFunctionTexts = index < 0 ? [] : transforms.slice(index);
    const beforeFunctions = stringToMatrixInfo(beforeFunctionTexts);
    const targetFunctions = stringToMatrixInfo([targetFunctionText]);
    const afterFunctions = stringToMatrixInfo(afterFunctionTexts);

    return {
        transforms,
        beforeFunctionMatrix: valueToMatrix(beforeFunctions),
        targetFunctionMatrix: valueToMatrix(targetFunctions),
        afterFunctionMatrix: valueToMatrix(afterFunctions),
        beforeFunctions,
        targetFunction: targetFunctions[0],
        afterFunctions,
        beforeFunctionTexts,
        targetFunctionText,
        afterFunctionTexts,
    };
}
