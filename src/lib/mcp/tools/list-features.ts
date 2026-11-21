import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { features } from "../content";

export default defineTool({
  name: "list_features",
  title: "List features",
  description:
    "List the public learning features of Bloom AI Learning, optionally filtered by a search term.",
  inputSchema: {
    query: z
      .string()
      .optional()
      .describe("Optional case-insensitive filter applied to feature titles and descriptions."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const term = query?.trim().toLowerCase();
    const matches = term
      ? features.filter(
          (f) =>
            f.title.toLowerCase().includes(term) || f.description.toLowerCase().includes(term),
        )
      : [...features];

    return {
      content: [
        {
          type: "text",
          text: matches.length
            ? matches.map((f) => `- ${f.title}: ${f.description}`).join("\n")
            : `No features matched "${query}".`,
        },
      ],
      structuredContent: { features: matches },
    };
  },
});
