import { defineTool } from "@lovable.dev/mcp-js";
import { appInfo } from "../content";

export default defineTool({
  name: "get_app_overview",
  title: "Get app overview",
  description:
    "Return an overview of Bloom AI Learning: what it is, who it is for, and its main pages.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: `${appInfo.name} — ${appInfo.tagline}\n\n${appInfo.summary}\n\nAudience: ${appInfo.audience}\nPages: ${appInfo.pages.join(", ")}`,
      },
    ],
    structuredContent: { app: appInfo },
  }),
});
