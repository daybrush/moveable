import Moveable, * as others from "./index.esm";

for (const name in others) {
    (Moveable as any)[name] = (others as any)[name];
}
export default Moveable;
