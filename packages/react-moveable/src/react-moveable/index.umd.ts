import Moveable, * as modules from "./index.esm";

for (const name in modules) {
    (Moveable as any)[name] = (modules as any)[name];
}

module.exports = Moveable;
export * from "./index.esm";
export default Moveable;
