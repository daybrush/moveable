var helper = require("@daybrush/jsdoc/lib/jsdoc/util/templateHelper");

var htmlsafe = helper.htmlsafe;
var linkto = helper.linkto;


function buildItemTypeStrings(item) {
    var types = [];

    if (item && item.type && item.type.names) {
        item.type.names.forEach(function(name) {
            types.push( linkto(name, htmlsafe(name)) );
        });
    }

    return types;
}

exports.publish = function(taffyData, opts, tutorials) {
    const data = helper.prune(taffyData);
    const result = {};
    const isSplitProperties = true;

    data().each(function(doclet) {
        const {
            name,
            longname,
            kind,
            description,
        } = doclet;

        if (kind === "typedef") {
            const properties = {};
            doclet.properties.forEach(item => {
                const type = buildItemTypeStrings(item);

                properties[item.name] = {
                    name: item.name,
                    type,
                    description: item.description,
                    optional: item.optional,
                };

                if (isSplitProperties) {
                    result[`${longname}.${item.name}`] = properties[item.name];
                }
            });

            result[longname] = {
                name,
                longname,
                kind,
                properties,
            };
        } else if (kind === "function") {
            result[longname] = {
                name,
                longname,
                description,
                kind,
                params: doclet.params.map(item => {
                    const types = buildItemTypeStrings(item);

                    return {
                        name: item.name,
                        type: types,
                        description: item.description,
                    }
                }),
                returns: doclet.returns.map(item => {
                    const types = buildItemTypeStrings(item);

                    return {
                        type: types,
                        description: item.description,
                    }
                }),
            };
        } else if (kind === "member") {
            result[longname] = {
                name,
                longname,
                kind,
                description,
                scope: doclet.scope,
                types: buildItemTypeStrings(doclet),
            };
        } else if (kind === "event") {
            result[longname] = {
                name,
                longname,
                kind,
                description,
                params: doclet.params.map(item => {
                    return {
                        name: item.name || "",
                        type: buildItemTypeStrings(item),
                        description: item.description,
                    };
                }),
            }
        } else if (kind === "namespace") {
            result[longname] = {
                kind,
                name,
                longname,
                description,
            }
        } else {
            console.log(kind);
        }
    });

    return result;
}
