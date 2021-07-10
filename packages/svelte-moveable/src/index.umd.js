import Moveable from "./index.js";
import * as modules from "moveable";

for (const name in modules) {
    Moveable[name] = modules[name];
}

export default Moveable;
