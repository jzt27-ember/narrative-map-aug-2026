/* =========================================================================
   LLM API — placeholder
   Not wired in yet. This is where narrative generation/summarisation would
   plug in once this prototype graduates past hardcoded data/narratives.js.

   Do NOT call a provider (Anthropic, OpenAI, etc.) directly from this
   client-side file with a bare API key — that exposes the key to anyone who
   opens the page. Route requests through a small backend/serverless proxy
   that holds the key server-side, and have this file call that proxy.

   Expected shape once wired up:
     generateNarrative({ name, clean, windSolar, fossil }) -> Promise<string>
   ========================================================================= */

async function generateNarrative(country){
  throw new Error("generateNarrative() is not implemented yet — wire this up to a backend proxy that calls the LLM API.");
}
