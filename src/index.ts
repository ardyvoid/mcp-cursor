// Import required dependencies
import path from 'path';
// Import MCP server functionality from the Model Context Protocol SDK
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// For executing shell commands
import { exec } from 'child_process';
// For runtime type validation
import { z } from 'zod';
// Import transport layer for stdio communication
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Path to the AppleScript that will interact with Cursor
const CURSOR_SCRIPT = path.join(__dirname, '/scripts/cursor.applescript');

// Initialize the MCP server with basic configuration
const server = new McpServer({
  name: 'cursor-agent-prompt',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register a tool that allows executing commands in Cursor
server.tool(
  'execute_in_cursor',
  'Execute a command in Cursor',
  {
    // Define the expected input parameter using Zod schema
    inputText: z.string(),
  },
  async (args) => {
    const { inputText } = args;

    try {
      // Execute the AppleScript command, escaping double quotes in the input
      await new Promise((resolve, reject) => {
        exec(
          `osascript ${CURSOR_SCRIPT} "${inputText.replace(/"/g, '\\"')}"`,
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
              return;
            }
            if (stderr) {
              reject(new Error(stderr));
              return;
            }
            resolve(stdout);
          }
        );
      });

      // Return success response
      return {
        content: [
          {
            type: 'text',
            text: 'sent',
          },
        ],
      };
    } catch (error) {
      // Return error response if execution fails
      return {
        content: [
          {
            type: 'text',
            text: `Error executing command: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// Main function to start the server
async function main() {
  // Initialize stdio transport layer for communication
  const transport = new StdioServerTransport();
  // Connect the server to the transport
  await server.connect(transport);
}

// Start the server and handle any startup errors
main().catch((error) => {
  console.error('Error starting server', error);
  process.exit(1);
});
