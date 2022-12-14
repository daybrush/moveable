import { GroupArrayChild, GroupSingleChild } from "./groups";

export type TargetGroupWithId = { groupId: string; children: TargetGroupsObject };
export type TargetRef = { current: HTMLElement | SVGElement | null };
export type TargetGroupsObject
    = Array<HTMLElement | SVGElement | TargetRef | TargetGroupsObject | TargetGroupWithId>;
export type TargetGroupsType = Array<HTMLElement | SVGElement | TargetGroupsType>;
export type GroupChild = GroupSingleChild | GroupArrayChild;

export interface TargetList {
    raw(): GroupChild[];
    flatten(): Array<HTMLElement | SVGElement>;
    targets(): TargetGroupsType;
}
