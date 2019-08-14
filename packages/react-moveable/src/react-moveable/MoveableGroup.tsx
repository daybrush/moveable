import MoveableManager from "./MoveableManager";
import { GroupableProps, Able } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
import { getAbleDragger } from "./getAbleDragger";
import Groupable from "./ables/Groupable";
import Origin from "./ables/Origin";
import { MOVEABLE_ABLES } from "./consts";

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
        groupable: true,
        ables: MOVEABLE_ABLES,
        targets: [],
    };
    public differ: ChildrenDiffer<HTMLElement | SVGElement> = new ChildrenDiffer();
    public moveables: MoveableManager[] = [];
    public groupAbles: Able[] = [Groupable];
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
            state.target = this.groupTargetElement;

            this.updateAbles();
            this.targetDragger = getAbleDragger(this, state.target!, "groupAbles", "");
            this.controlDragger = getAbleDragger(this, this.controlBox.getElement(), "groupAbles", "Control");
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
    public triggerEvent(name: string, e: any) {
        if (name.indexOf("onGroup") === 0) {
            return super.triggerEvent(name as any, e);
        }
    }
    protected renderAbles() {
        const ables = [...this.props.ables!, Groupable, Origin];

        return ables.map(({ render }) => render && render(this));
    }
}
