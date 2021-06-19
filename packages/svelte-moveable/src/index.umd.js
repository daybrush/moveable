import Moveable, * as modules from "./index";

for (const name in modules) {
    Moveable[name] = modules[name];
}

export default Moveable;
