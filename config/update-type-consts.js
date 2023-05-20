const path = require("path");
const { convertProperties } = require("@daybrush/release/angular");
const { MOVEABLE_PROPS, MOVEABLE_EVENTS } = require("../packages/react-moveable/dist/moveable.cjs");

convertProperties(
    {
        "ANGULAR_MOVEABLE_INPUTS": MOVEABLE_PROPS,
        "ANGULAR_MOVEABLE_OUTPUTS": MOVEABLE_EVENTS,
    },
    [
        path.resolve(__dirname, "../packages/ngx-moveable/projects/ngx-moveable/src/public-api.ts"),
    ],
);
