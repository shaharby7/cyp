// /* eslint-disable no-console */
// import { Command } from "commander";
// import { OpenChat } from "./chat";

// const main = async () => {
//   try {
//     const program = new Command();

//     program
//       .name("cyp")
//       .description("AI command line helper based on MCP")
//       .version("0.1.0")
//       .option("-e, --execute", "execute commands without asking for permission")
//       .argument("<string>", "prompt")
//       .action((str, options) => {
//         OpenChat(str, options.execute);
//       });

//     program.parse();
//   } catch (error) {
//     console.error("An error occurred while trying to load the cli:", error);
//   }
// };

// main();

import { MCPClient } from "./chat";

async function main() {
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer();
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();
