const path = require("path");
const fs = require("fs");
const config = require("../neutralino.config.json");

const environment = [].concat(process.argv).slice(2).includes("production")
  ? "production"
  : "development";

const projectName = path.basename(process.cwd());

config.modes.window.title = projectName;
config.cli.binaryName = projectName;
config.modes.window.enableInspector = environment !== "production";
config.globalVariables.ENVIRONMENT = environment;
config.modes.browser.globalVariables.ENVIRONMENT = environment;

fs.writeFileSync(
  path.join(process.cwd(), "neutralino.config.json"),
  JSON.stringify(config, undefined, 2),
  { encoding: "utf-8" }
);
