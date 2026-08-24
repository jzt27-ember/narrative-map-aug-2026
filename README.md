# narrative-map-aug-2026

Internal sprint prototype: a clickable world map surfacing Ember's energy-transition narratives by country.

Static site, no build step — open [index.html](index.html) directly in a browser.

## Structure

- [index.html](index.html) — markup only
- [css/styles.css](css/styles.css) — design/styling (Ember data viz guide tokens)
- [data/narratives.js](data/narratives.js) — per-country narrative data (`NARRATIVES`, keyed by ISO numeric country code)
- [js/app.js](js/app.js) — map rendering, quick-jump list, panel behaviour
- [api/llm.js](api/llm.js) — placeholder for LLM-generated narratives; not wired in yet. Calls a provider directly from browser JS only if a key-free backend/serverless proxy is added first — never ship an API key client-side.
