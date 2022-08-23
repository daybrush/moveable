import Moveable, * as modules from "./index";

for (const name in modules) {
    (Moveable as any)[name] = (modules as any)[name];
}

module.exports = Moveable;
export * from "./index";
export default Moveable;
