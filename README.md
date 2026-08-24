# narrative-map-aug-2026

Internal sprint prototype: a clickable world map surfacing Ember's energy-transition narratives by country.

Static site, no build step. Open [index.html](index.html) directly for map + panel browsing. To use the "Draft narrative with AI" button on countries not yet in the dataset, run the local server instead (see below) so a Gemini API key can be held server-side.

## Structure

- [index.html](index.html) — markup only
- [css/styles.css](css/styles.css) — design/styling (Ember data viz guide tokens)
- [data/narratives.js](data/narratives.js) — per-country narrative data (`NARRATIVES`, keyed by ISO numeric country code)
- [js/app.js](js/app.js) — map rendering, quick-jump list, panel behaviour
- [api/llm.js](api/llm.js) — calls the `/api/generate-narrative` proxy (see `server.js`) to draft narrative prose with Gemini. Never calls a provider directly from browser JS with a bare key.
- [server.js](server.js) — zero-dependency Node server: serves the static site and proxies narrative-drafting requests to Gemini, holding `GEMINI_API_KEY` server-side.

## Using the AI drafting feature

1. Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env` and paste the key in as `GEMINI_API_KEY=...`. `.env` is gitignored — it never gets committed.
3. Run `node server.js` (or `npm start`), then open `http://localhost:8787`.
4. Click any grey (not-yet-wired) country on the map and use "Draft narrative with AI (Gemini)" to get a first-pass headline/narrative/note.

Drafts are generated with no source documents attached, so they're **unverified** — fact-check against the real Ember country page before copying a draft's fields into `data/narratives.js`, and fill in real clean/wind+solar/fossil percentages yourself (the model is instructed not to invent precise stats). Grounding drafts in real Ember documents (RAG) is the planned next step.
