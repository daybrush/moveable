import { isArray } from "@daybrush/utils";
import { MoveableTargetGroupsType } from "src/react-moveable";

export interface GroupSingleChild {
    parent: GroupArrayChild;
    type: "single";
    value: HTMLElement | SVGElement;
}

export type GroupChild = GroupSingleChild | GroupArrayChild;

export class Child {
    public type: "group" | "root" | "single" = "single";
    constructor(public parent?: GroupArrayChild) { }
}

export class GroupSingleChild extends Child {
    public type: "single" = "single";
    constructor(parent: GroupArrayChild, public value: HTMLElement | SVGElement) {
        super(parent);
    }
}
export class GroupArrayChild extends Child {
    public type: "group" | "root" = "group";
    public value: GroupChild[] = [];
    public map: Map<HTMLElement | SVGElement, GroupSingleChild> = new Map();

    public compare(groups: MoveableTargetGroupsType) {
        const elements = groups.flat(3) as Array<HTMLElement | SVGElement>;
        const map = this.map;

        return map.size === elements.length
            && elements.every(element => map.has(element));
    }
    public has(target: HTMLElement | SVGElement) {
        return this.map.has(target);
    }
    public findExactChild(target: MoveableTargetGroupsType[0]): GroupChild | undefined {
        const map = this.map;

        if (!isArray(target)) {
            return map.get(target);
        }
        const flattern = target.flat(3) as Array<HTMLElement | SVGElement>;
        const length = flattern.length;
        const single = map.get(flattern[0]);

        if (!single) {
            return;
        }

        let parent: GroupArrayChild | undefined = single.parent;

        while (parent) {
            if (parent.map.size === length) {
                return parent;
            }
            parent = parent.parent;
        }
        return;
    }
    public findNextChild(
        target: HTMLElement | SVGElement,
        range: MoveableTargetGroupsType = this.toTargetGroups(),
        isExact?: boolean,
    ): GroupArrayChild | null {
        let nextChild: GroupArrayChild | null = null;

        const length = range.length;
        range.some(child => {
            if (!isExact && length === 1 && isArray(child)) {
                nextChild = this.findNextChild(target, child);
                return nextChild;
            }

            const nextGroupChild = this.findExactChild(child);

            if (!nextGroupChild) {
                return;
            }

            if ("map" in nextGroupChild) {
                if (nextGroupChild.map.has(target)) {
                    nextChild = nextGroupChild;
                    return true;
                }
            }
        });

        return nextChild;
    }
    public findNextExactChild(
        target: HTMLElement | SVGElement,
        range: MoveableTargetGroupsType,
        selected: Array<HTMLElement | SVGElement>,
    ): GroupArrayChild | null {
        // [[1, 2]] => group([1, 2]) exact
        // [[[1, 2], 3]] => group([1, 2])
        const nextChild = this.findNextChild(target, range, true);

        if (!nextChild) {
            return null;
        }


        const map = nextChild.map;

        if (selected.filter(element => map.has(element)).length === map.size) {
            return nextChild;
        }
        return null;
    }
    public findCleanChild(
        target: HTMLElement | SVGElement,
        range: Array<HTMLElement | SVGElement>,
    ): GroupArrayChild | null {
        let nextGroupChild: GroupArrayChild | null = null;

        const childSelected = range.filter(element => this.has(element));

        if (!childSelected.length) {
            return this;
        }

        this.value.some(nextChild => {
            if (nextChild.type !== "single" && nextChild.has(target)) {
                nextGroupChild = nextChild.findCleanChild(target, childSelected);

                if (nextGroupChild) {
                    return true;
                }
            }
        });

        return nextGroupChild;
    }
    public toTargetGroups(): MoveableTargetGroupsType {
        return this.value.map(child => {
            if (child.type === "single") {
                return child.value;
            } else {
                return child.toTargetGroups();
            }
        });
    }
}

export function createRootChild(
    targets: Array<HTMLElement | SVGElement>,
    targetGroups: MoveableTargetGroupsType,
) {
    const map: Map<HTMLElement | SVGElement, GroupSingleChild> = new Map();
    const value: GroupChild[] = [];
    const root = new GroupArrayChild();

    root.type = "root";
    createGroupChildren(targetGroups, root);

    targets.forEach(target => {
        if (map.has(target)) {
            return;
        }
        const single = new GroupSingleChild(root, target);

        value.push(single);
        map.set(target, single);
    });

    return root;
}

export function createGroupChildren(
    targetGroups: MoveableTargetGroupsType,
    parent: GroupArrayChild,
) {
    const {
        value,
        map,
    } = parent;
    targetGroups.forEach(child => {
        if (isArray(child)) {
            const group = new GroupArrayChild(parent);


            value.push(group);

            createGroupChildren(child, group);
        } else {
            const single = new GroupSingleChild(parent, child);

            value.push(single);
            map.set(child, single);
        }
    });

    value.forEach(child => {
        if (child.type === "single") {
            map.set(child.value, child);
        } else {
            child.map.forEach((nextChild, element) => {
                map.set(element, nextChild);
            });
        }
    });
    return parent;
}
