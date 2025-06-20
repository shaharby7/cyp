/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 */

/* eslint-disable */
const tsNode = require("ts-node");

delete process.env.NODE_ENV;
process.env.IS_TEST = true;

/* eslint-disable */
module.exports = () => {
  tsNode.register({
    files: true,
    transpileOnly: true,
    project: "./tsconfig.json",
  });
};
