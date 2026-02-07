import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import env from "../../../env";

// create openrouter instance
const openRouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_KEY,
});

export default openRouter;
