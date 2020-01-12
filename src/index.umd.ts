import Moveable, * as modules from "./index.esm";

for (const name in modules) {
    (Moveable as any)[name] = modules[name];
}

export default Moveable;
