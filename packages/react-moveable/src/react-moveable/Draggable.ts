import Moveable from "./Moveable";
import { invert, caculate, minus, sum, convertPositionMatrix } from "./matrix";

export function dragStart(moveable: Moveable, { datas }: any) {
    const {
        absoluteMatrix,
        beforeMatrix,
        is3d,
        left,
        top,
        origin,
    } = moveable.state;

    const n = is3d ? 4 : 3;
    datas.is3d = is3d;
    datas.absoluteMatrix = absoluteMatrix;
    datas.inverseAbsoluteMatrix = invert(absoluteMatrix, n);
    datas.beforeMatrix = beforeMatrix;
    datas.inverseBeforeMatrix = invert(beforeMatrix, n);
    datas.absoluteOrigin = convertPositionMatrix(sum([left, top], origin), n);
    datas.startDragBeforeDist = caculate(datas.inverseBeforeMatrix, datas.absoluteOrigin, is3d ? 4 : 3);
    datas.startDragAbsoluteDist = caculate(datas.inverseAbsoluteMatrix, datas.absoluteOrigin, is3d ? 4 : 3);
}
export function getDragDist({ datas, distX, distY }: any, isBefore?: boolean) {
    const {
        inverseBeforeMatrix,
        inverseAbsoluteMatrix, is3d,
        startDragBeforeDist,
        startDragAbsoluteDist, absoluteOrigin,
    } = datas;
    const n = is3d ? 4 : 3;

    return minus(
        caculate(
            isBefore ? inverseBeforeMatrix : inverseAbsoluteMatrix,
            sum(absoluteOrigin, [distX, distY]),
            n,
        ),
        isBefore ? startDragBeforeDist : startDragAbsoluteDist,
    );
}
