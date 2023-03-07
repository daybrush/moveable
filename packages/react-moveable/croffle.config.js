const {
    ReactCroissant,
    VueWaffle,
    ConvertDefaultModulePrefixSirup,
    SvelteWaffle,
} = require("croffle");


/**
 * @param {import("croffle").Sirup} sirup
 */
function vueKeyconSirup(sirup) {
    sirup.requestId({
        path: [/vue[3]?-keycon/g, "useKeycon"],
        named: ["isKeydown"],
    }, node => {
        // use ref
        return sirup.utils.createInlinePropertyAccess(node, "value");
    });
}
/**
 * @param {import("croffle").Sirup} sirup
 */
function svelteKeyconSirup(sirup){
    sirup.requestId({
        path: [/svelte-keycon/g, "useKeycon"],
        named: ["isKeydown"],
    }, node => {
        // use writable
        return sirup.ts.factory.createIdentifier(`$${node.name.escapedText}`);
    });
}

/**
 * @param {import("croffle").Sirup} sirup
 */
function PreviewPropsSirup(sirup) {
    sirup.requestProps((node, { data }) => {
        if (!data.props) {
            data.props = [];
        }
        node.members.forEach(member => {
            const propName = member.name.escapedText;

            data.props.push(propName);
        });

        return sirup.utils.copyInterfaceDeclaration(node, { members: [] });
    });

    sirup.requestLifeCycle("created", (node, { data }) => {
        if (!data.props || !data.props.length) {
            return;
        }

        const statements = data.props.map(name => {
            return sirup.utils.createInlineCroffleAssignment(
                name,
                "Any",
                sirup.factory.createStringLiteral(`$preview_${name}`),
            );
        });
        const body = node.body;

        return sirup.utils.copyFunctionDeclaration(
            node,
            {
                body: sirup.factory.updateBlock(body, [
                    ...statements,
                    ...body.statements,
                ]),
            },
        );
    });
};

/**
 * @type {import("@croffle/bakery").CroffleConfig[]}
 */
const config = [
    {
        targets: "stories/**/+([0-9A-Za-z])-*/React*App.tsx",
        croissant: () => {
            const croissant = new ReactCroissant();

            croissant.addSirup(PreviewPropsSirup);
            croissant.addSirup(sirup => {
                sirup.convertImport("@/react-moveable", "react-moveable");
            });
            croissant.addSirup(ConvertDefaultModulePrefixSirup);
            return croissant;
        },
        defrosted: (defrosted, croissant) => {
            const app = defrosted.app;
            const results = croissant._findUsedSpecifiers(app, "react-dom", "createPortal");

            return !results.length;
        },
        waffle: [
            // Vue 3
            (defrosted) => {
                const hasKeycon = !!defrosted.allRequires["react-keycon"];
                const waffle = new VueWaffle();

                waffle.addSirup(ConvertDefaultModulePrefixSirup);


                if (hasKeycon) {
                    waffle.addSirup(
                        sirup => {
                            sirup.convertImport("vue3-keycon", "vue-keycon");
                        },
                        vueKeyconSirup,
                    );
                }
                return {
                    dist: `./{type}/{name}/App{ext}`,
                    waffle,
                };
            },
            // Vue 2
            (defrosted) => {
                const hasKeycon = !!defrosted.allRequires["react-keycon"];
                const waffle = new VueWaffle({
                    useVue2: true,
                    useOptionsAPI: !hasKeycon,
                });

                waffle.addSirup(ConvertDefaultModulePrefixSirup);

                if (hasKeycon) {
                    waffle.addSirup(
                        sirup => {
                            sirup.convertImport("vue-keycon", "vue2-keycon");
                        },
                        vueKeyconSirup,
                    );
                }
                return {
                    dist: `./{type}/{name}/App{ext}`,
                    waffle,
                };
            },
            // Svelte
            (defrosted) => {
                const hasKeycon = !!defrosted.allRequires["react-keycon"];
                const waffle = new SvelteWaffle();

                waffle.addSirup(ConvertDefaultModulePrefixSirup);

                if (hasKeycon) {
                    waffle.addSirup(svelteKeyconSirup);
                }
                return {
                    dist: `./{type}/{name}/App{ext}`,
                    waffle,
                };
            },
        ],
    },
];


module.exports = config;
