import { deepFlat, isArray } from "@daybrush/utils";
import { MoveableTargetGroupsType } from "src/react-moveable";

export type GroupChild = GroupSingleChild | GroupArrayChild;

export class Child {
    public type: "group" | "root" | "single" = "single";
    public depth = 0;
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

    public compare(groups: MoveableTargetGroupsType, checker: -1 | 0 | 1 = 0) {
        const elements = deepFlat(groups);
        const map = this.map;
        const elementsLength = elements.length;
        const mapSize = map.size;
        const sizeDiff = mapSize - elementsLength;

        // 1 this > groups
        // 0 this = groups
        // -1 this < groups
        const count = elements.filter(element => map.has(element)).length;

        if ((checker > 0 && sizeDiff >= 0) || (checker === 0 && sizeDiff === 0)) {
            return elementsLength === count;
        } else if (checker < 0 && sizeDiff <= 0) {
            return mapSize === count;
        }
        return false;
    }
    public has(target: HTMLElement | SVGElement) {
        return this.map.has(target);
    }
    public findExactChild(target: MoveableTargetGroupsType[0]): GroupChild | undefined {
        const map = this.map;

        if (!isArray(target)) {
            return map.get(target);
        }
        const flatted = deepFlat(target);
        const length = flatted.length;
        const single = map.get(flatted[0]);

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
    public findCommonParent(targets: MoveableTargetGroupsType): GroupArrayChild {
        let depth = Infinity;
        let childs = targets.map(target => this.findExactChild(target));

        childs.forEach(child => {
            if (!child) {
                return;
            }
            depth = Math.min(child.depth, depth);
        });

        while (depth) {
            --depth;
            childs = childs.map(child => {
                let parent: GroupChild | undefined = child;

                while (parent && parent.depth !== depth) {
                    parent = parent.parent;
                }

                return parent;
            });
            const firstChild = childs.find(child => child);

            if (!firstChild) {
                return this;
            }
            if (childs.every(child => !child || child === firstChild)) {
                break;
            }
        }
        const commonParent = childs.find(child => child) as GroupArrayChild;

        return commonParent || this;
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
        selected: Array<HTMLElement | SVGElement>,
        range: MoveableTargetGroupsType = this.toTargetGroups(),
    ): GroupArrayChild | null {
        // [[1, 2]] => group([1, 2]) exact
        // [[[1, 2], 3]] => group([1, 2])
        const nextChild = this.findNextChild(target, range, true);

        if (!nextChild) {
            return null;
        }

        if (nextChild.compare(selected, -1)) {
            return nextChild;
        }
        return null;
    }
    public findPureChild(
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
                nextGroupChild = nextChild.findPureChild(target, childSelected);

                if (nextGroupChild) {
                    return true;
                }
            }
        });

        return nextGroupChild;
    }
    public findNextPureChild(
        target: HTMLElement | SVGElement,
        range: Array<HTMLElement | SVGElement>,
    ): GroupArrayChild | null {
        const nextChild = this.findNextChild(target);

        if (nextChild) {
            return nextChild.findPureChild(target, range);
        }
        return null;
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

    public groupByPerfect(selected: Array<HTMLElement | SVGElement>) {
        return this.value.filter(child => {
            if (child.type !== "single") {
                return child.compare(selected, -1);
            }
            return selected.indexOf(child.value) > -1;
        });
    }
}

export function createRootChild(
    targets: Array<HTMLElement | SVGElement>,
    targetGroups: MoveableTargetGroupsType,
) {
    const root = new GroupArrayChild();
    const map = root.map;
    const value = root.value;
    root.type = "root";
    createGroupChildren(targetGroups, root);


    targets.forEach(target => {
        if (map.has(target)) {
            return;
        }
        const single = new GroupSingleChild(root, target);

        single.depth = 1;
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

            group.depth = parent.depth + 1;
            value.push(group);

            createGroupChildren(child, group);
        } else {
            const single = new GroupSingleChild(parent, child);

            single.depth = parent.depth + 1;
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
