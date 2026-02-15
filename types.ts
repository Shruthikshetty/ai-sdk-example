export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export type Providers =
  | "openrouter"
  | "google"
  | "groq"
  | "gateway"
  | "openai"
  | "ollama";
