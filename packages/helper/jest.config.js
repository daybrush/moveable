module.exports = {
    "roots": [
        "<rootDir>",
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
    },
    "testMatch": ["<rootDir>/test/**/*.spec.ts"],
    // "testRegex": "spec\\.ts$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
    ],
};
