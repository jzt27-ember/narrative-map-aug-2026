# narrative-map-aug-2026

Personalized country dossier surfacing Ember's energy-transition narratives: official record vs. "ground signal" per claim, and the levers a planner holds vs. doesn't.

React + Vite + Tailwind. Requires a build step now (this replaced an earlier zero-build vanilla JS/D3 map prototype).

## Running it

```
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

## Structure

- [index.html](index.html) — Vite entry point, mounts `#root`
- [src/main.jsx](src/main.jsx) — React root
- [src/CountryLanding.jsx](src/CountryLanding.jsx) — the dossier page: header (country/role/tier/archetype/horizon), stat grid, per-narrative official-record-vs-ground-signal cards, levers held/elsewhere. Data-driven — swap the `data` prop for a different country. Currently rendered with its bundled `vietnam` example data; only that country has data in this shape so far.
- [data/narratives.js](data/narratives.js), [data/sources/](data/sources/) — content from the earlier map prototype (headline/narrative/note + stats, and free-text source documents per country). Not yet in the shape `CountryLanding` expects (official/ground-signal pairs, levers) — kept for reference and as raw material for building out more countries' dossiers.
- [server.js](server.js), [api/llm.js](api/llm.js) — Gemini-backed narrative drafting proxy from the earlier prototype. **Currently orphaned**: not wired into the new dossier UI. Kept in case AI-assisted drafting gets reintroduced against the new data shape.

## Deployment

Pushing to `main` builds and deploys automatically via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) to GitHub Pages (repo Pages settings are configured to deploy from GitHub Actions, not by serving the repo directly — the built `index.html` needs bundled JS, so raw-file serving no longer works).

## Using the (currently disconnected) AI drafting feature

This still works standalone via `node server.js`, but isn't called from the current UI.

1. Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env` and paste the key in as `GEMINI_API_KEY=...`. `.env` is gitignored — it never gets committed.
3. Run `node server.js` (or `npm start`), then `POST` to `http://localhost:8787/api/generate-narrative` with `{"name": "<country>"}`.

### Weekly hot-topic analysis

`POST /api/hot-topics` with `{"name": "<country>"}` (optionally `"startDate"`/`"endDate"`, ISO dates — defaults to the last 7 days) runs [data/prompts/hot-topic-framework.md](data/prompts/hot-topic-framework.md) against Gemini: it scores candidate energy-system developments in the monitoring window and returns the top 3, ranked, each with a hotness score, the underlying issue, its implication, and an Ember-evidence-based recommendation.

```json
{
  "country": "Thailand",
  "monitoringPeriod": { "start": "2026-08-17", "end": "2026-08-24" },
  "grounded": true,
  "issues": [
    { "rank": 1, "headline": "...", "category": "...", "hotnessScore": 89, "issue": "...", "implication": "...", "emberRecommendation": "..." }
  ]
}
```

Like narrative drafting, this only has real news to work with if it's grounded — either via a `data/sources/<country-slug>` file (used as the candidate-issue pool) or `ENABLE_SEARCH_GROUNDING=true`. With neither, the response sets `"grounded": false` and includes a `"warning"` — the issues returned are the model's general knowledge, not an actual scan of the week's news, and shouldn't be trusted as-is.

### Grounding drafts in real sources

By default, drafts come from the model's general knowledge and are **unverified**.

To ground a draft in real source text instead, drop a file in
`data/sources/<country-slug>.txt` or `.md` (see [data/sources/README.md](data/sources/README.md))
— the server will use it as the only source of facts for that country, and the
response will flag the draft as sourced from your document (`groundedInLocalDoc: true`).

Alternatively, Gemini's Search-grounding tool can pull live web results, but it
requires a billing-enabled Google Cloud project (the free API tier doesn't
include it). Once billing is set up, set `ENABLE_SEARCH_GROUNDING=true` in `.env`
to turn it on for any country without a local source file.
