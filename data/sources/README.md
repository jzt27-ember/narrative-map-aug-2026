# Source documents for AI drafting

Drop a plain text or Markdown file here named after the country, and the
"Draft narrative with AI" button will ground its answer in that file instead
of the model's general knowledge.

- Filename: lowercase, spaces and punctuation replaced with hyphens, `.txt` or `.md`.
  Example: `data/sources/south-korea.txt` for "South Korea".
- Content: paste in the relevant Ember country-page text, report excerpts, or
  stats you want it to draw from. Plain prose is fine — no special format required.
- If no matching file exists for a country, the button falls back to an
  unverified general-knowledge draft (or a Search-grounded one, if
  `ENABLE_SEARCH_GROUNDING=true` is set and your Gemini project has billing enabled).
