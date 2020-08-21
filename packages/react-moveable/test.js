const fs = require("fs");
fs.readdirSync("./node_modules/css-to-mat/declaration").forEach(v => {
    console.log(v);
})

console.log(fs.readFileSync("./node_modules/css-to-mat/declaration/index.d.ts", { encoding: "utf-8" }));
