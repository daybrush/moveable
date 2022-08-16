import "./scroll.css";
import App from "./apps/ReactSelectoApp";
import RawApp from "!!raw-loader!./apps/ReactSelectoApp";
import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import { convertReactTemplate, convertPath } from "../utils";

export const SelectoTemplate = App as any;

SelectoTemplate.storyName = "Selecto with Moveable";
SelectoTemplate.argTypes = {};
SelectoTemplate.args = {};


SelectoTemplate.parameters = {
    preview: [
        // {
        //     tab: "CSS",
        //     template: DEFAULT_CSS_TEMPLATE + "\n" + SCROLL_CSS_TEMPLATE,
        //     language: "css",
        // },
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "react-selecto"]),
            language: "tsx",
        },
    ],
};

