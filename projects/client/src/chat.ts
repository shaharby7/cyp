import { Anthropic } from "@anthropic-ai/sdk";
import { MessageParam, Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}
const DEV_MODE = process.env.DEV_MODE === "true";

export class MCPClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: Transport | null = null;
  private tools: Tool[] = [];
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.mcp = new Client({ name: "cyp", version: "1.0.0" });
  }

  async connectToServer() {
    try {
      if (DEV_MODE) {
        this.transport = new StreamableHTTPClientTransport(new URL(`http://localhost:3000/mcp`));
      } else {
        throw new Error("DEV_MODE is not set to true. Please set it to true to run the server in development mode.");
      }

      await this.mcp.connect(this.transport);
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool): Tool => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: {
            type: "object",
            properties: tool.inputSchema.properties || {},
            required: tool.inputSchema.required || [],
          },
        };
      });
      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );
    } catch (e) {
      console.error("Error connecting to MCP server:", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    try {
      const messages: MessageParam[] = [
        {
          role: "user",
          content: query,
        },
      ];

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages,
        tools: this.tools,
      });

      const finalText = [];

      for (const content of response.content) {
        if (content.type === "text") {
          finalText.push(content.text);
        } else if (content.type === "tool_use") {
          const toolName = content.name;
          const toolArgs = content.input as { [x: string]: unknown } | undefined;

          const result = await this.mcp.callTool({
            name: toolName,
            arguments: toolArgs,
          });
          finalText.push(`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`);

          messages.push({
            role: "user",
            content: result.content as string,
          });

          const response = await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            messages,
          });

          finalText.push(response.content[0].type === "text" ? response.content[0].text : "");
        }
      }

      return finalText.join("\n");
    } catch (error) {
      console.error("Error processing query:", error);
      return "An error occurred while processing your query.";
    }
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}
