import { GroupArrayChild, GroupSingleChild } from "./groups";

export type TargetGroupsType = Array<HTMLElement | SVGElement | TargetGroupsType>;
export type GroupChild = GroupSingleChild | GroupArrayChild;
