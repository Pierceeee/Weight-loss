import { AIProvider } from "./provider";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

export type AIProviderType = "openai" | "gemini";

/**
 * Get the configured AI provider based on environment variables
 */
export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || "openai") as AIProviderType;

  switch (providerType) {
    case "gemini": {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error("GOOGLE_AI_API_KEY environment variable is required for Gemini provider");
      }
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      return new GeminiProvider(apiKey, model);
    }

    case "openai":
    default: {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY environment variable is required for OpenAI provider");
      }
      const model = process.env.OPENAI_MODEL || "gpt-4o";
      return new OpenAIProvider(apiKey, model);
    }
  }
}

/**
 * Check if AI provider is properly configured
 */
export function isAIConfigured(): boolean {
  const providerType = (process.env.AI_PROVIDER || "openai") as AIProviderType;

  switch (providerType) {
    case "gemini":
      return !!process.env.GOOGLE_AI_API_KEY;
    case "openai":
    default:
      return !!process.env.OPENAI_API_KEY;
  }
}

// Re-export types
export type { AIProvider } from "./provider";
export { OpenAIProvider } from "./openai";
export { GeminiProvider } from "./gemini";
