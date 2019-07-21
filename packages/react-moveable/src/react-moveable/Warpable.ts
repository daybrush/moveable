import Moveable from "./Moveable";
import { warp as warpMatrix } from "./utils";

export function warpStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!position || !target) {
        return false;
    }
    const { pos1, pos2, pos3, pos4 } = moveable.state;

    datas.transform = window.getComputedStyle(target!).transform;
    datas.position = position;

    datas.poses = [pos1, pos2, pos3, pos4];
    datas.posNum =
        (position[0] === -1 ? 0 : 1)
        + (position[1] === -1 ? 0 : 2);

    if (datas.transform === "none") {
        datas.transform = "";
    }

    moveable.props.onWarpStart!({
        target,
        clientX,
        clientY,
    });
}

export function warp(moveable: Moveable, { datas, clientX, clientY, distX, distY, deltaX, deltaY }: any) {
    const { posNum, poses } = datas;
    const target = moveable.props.target!;
    // moveable.setState({
    //     [posName]: [x + deltaX, y + deltaY],
    // });

    const nextPoses: number[][] = poses.slice();

    nextPoses[posNum] = [poses[posNum][0] + distX, poses[posNum][1] + distY];

    const h = warpMatrix(
        poses[0],
        poses[1],
        poses[2],
        poses[3],
        nextPoses[0],
        nextPoses[1],
        nextPoses[2],
        nextPoses[3],
    );

    target.style.transform = `${datas.transform} matrix3d(${h.join(",")})`;

}
