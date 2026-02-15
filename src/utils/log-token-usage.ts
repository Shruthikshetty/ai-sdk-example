/* eslint-disable @typescript-eslint/no-explicit-any */
import { StreamTextResult } from "ai";

export const logTokenUsage = (result: StreamTextResult<any, any>) => {
  // log the token usage
  result.usage.then((usage) => {
    console.log("token usage ----->", {
      inputTokens: usage?.inputTokens,
      outputTokens: usage?.outputTokens,
      totalTokens: usage?.totalTokens,
    });
  });
};
