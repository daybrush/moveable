import Moveable, * as others from "./index.esm";
// import MoveableGroup from "./MoveableGroup";

// (Moveable as any).MoveableGroup = MoveableGroup;

for (const name in others) {
    (Moveable as any)[name] = (others as any)[name];
}
export default Moveable;
