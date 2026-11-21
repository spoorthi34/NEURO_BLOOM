import { defineTool } from "@lovable.dev/mcp-js";
import { steps } from "../content";

export default defineTool({
  name: "get_learning_workflow",
  title: "Get learning workflow",
  description:
    "Return the step-by-step workflow a learner follows in Bloom AI Learning, from upload to tracking progress.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: steps.map((s) => `${s.step}. ${s.title} — ${s.description}`).join("\n"),
      },
    ],
    structuredContent: { steps },
  }),
});
