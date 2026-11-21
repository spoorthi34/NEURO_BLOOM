import { defineMcp } from "@lovable.dev/mcp-js";
import getAppOverviewTool from "./tools/get-app-overview";
import listFeaturesTool from "./tools/list-features";
import getLearningWorkflowTool from "./tools/get-learning-workflow";

export default defineMcp({
  name: "bloom-ai-learning",
  title: "Bloom AI Learning",
  version: "0.1.0",
  instructions:
    "Public, read-only tools describing Bloom AI Learning — an AI learning space for neurodivergent learners. Use `get_app_overview` for what the product is, `list_features` for its learning features, and `get_learning_workflow` for the learner journey.",
  tools: [getAppOverviewTool, listFeaturesTool, getLearningWorkflowTool],
});
