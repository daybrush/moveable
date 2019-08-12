import MoveableManager from "./MoveableManager";
import { GroupableProps } from "./types";
import { MOVEABLE_GROUP_ABLES } from "./consts";
import ChildrenDiffer from "@egjs/children-differ";

function getMaxPos(moveables: MoveableManager[], index: number) {
    return Math.max(...moveables.map(({ state: { left, top, pos1, pos2, pos3, pos4 } }) => {
        return (index ? top : left) + Math.max(pos1[index], pos2[index], pos3[index], pos4[index]);
    }));
}
function getGroupRect(moveables: MoveableManager[]) {
    if (!moveables.length) {
        return [0, 0, 0, 0];
    }
    const groupLeft = Math.min(...moveables.map(({ state: { left } }) => left));
    const groupTop = Math.min(...moveables.map(({ state: { top } }) => top));
    const groupWidth = getMaxPos(moveables, 0) - groupLeft;
    const groupHeight = getMaxPos(moveables, 1) - groupTop;

    return [groupLeft, groupTop, groupWidth, groupHeight];
}

export default class MoveableGroup extends MoveableManager<GroupableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        ables: MOVEABLE_GROUP_ABLES,
        targets: [],
    };
    public differ: ChildrenDiffer<HTMLElement | SVGElement> = new ChildrenDiffer();
    public moveables: MoveableManager[] = [];
    private groupTargetElement!: HTMLElement;

    public componentDidMount() {
        super.componentDidMount();
        this.updateRect();
    }
    public componentDidUpdate() {
        this.update(true);
    }
    public update(isSetState?: boolean) {
        if (!isSetState) {
            return;
        }
        const state = this.state;
        if (!state.target) {
            state.target = document.createElement("div");
        }
        this.moveables.forEach(moveable => moveable.update(false));

        const { added, changed } = this.differ.update(this.props.targets!);

        if (added.length || changed.length) {
            this.updateRect();
        }
        return true;
    }
    public updateRect(isTarget?: boolean, isSetState: boolean = true) {
        this.moveables.forEach(moveable => {
            moveable.updateRect(isTarget, false);
        });
        const [left, top, width, height] = getGroupRect(this.moveables);
        const pos1 = [0, 0];
        const pos2 = [width, 0];
        const pos3 = [0, height];
        const pos4 = [width, height];

        this.updateState({
            left,
            top,
            width,
            height,
            pos1,
            pos2,
            pos3,
            pos4,
        }, isSetState);
    }
}
