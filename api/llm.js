/* =========================================================================
   LLM API — Gemini-backed narrative drafting
   Calls the local proxy in server.js, which holds GEMINI_API_KEY
   server-side. Never call a provider directly from this browser file with
   a bare API key — that exposes it to anyone who opens the page.

   No source documents are wired in yet, so drafts are unverified and must
   be fact-checked against real Ember data before going into
   data/narratives.js. Adding document grounding (RAG) is next.
   ========================================================================= */

async function generateNarrative({ name }){
  const res = await fetch("/api/generate-narrative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok){
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data.draft;
}
