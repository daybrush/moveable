import * as React from "react";
import { themes } from "@storybook/theming";
import {
    INITIAL_VIEWPORTS,
    // or MINIMAL_VIEWPORTS,
} from "@storybook/addon-viewport";

import {
    Title,
    Primary,
    PRIMARY_STORY,
    ArgsTable,
    DocsContainer,
    DocsContext,
} from "@storybook/addon-docs";

// or global addParameters
export const parameters = {
    docs: {
        container: DocsContainer,
        page: () => {
            const context = React.useContext(DocsContext);

            return <>
                <Title />
                <h2 className={"sbdocs-subtitle"}>{context.name}</h2>
                <Primary />
                <ArgsTable story={PRIMARY_STORY} />
            </>;
        },
    },
    controls: {
        passArgsFirst: true,
        expanded: true,
        hideNoControlsWarning: true,
    },
    viewport: {
        viewports: {
            ...INITIAL_VIEWPORTS,
        },
    },
    darkMode: {
        // Override the default light theme
        light: { ...themes.normal },
        // Override the default dark theme
        dark: { ...themes.dark },
    },
};
