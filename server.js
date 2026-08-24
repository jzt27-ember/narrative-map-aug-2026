/* =========================================================================
   Local dev server + Gemini proxy.
   Serves the static site and exposes:
     POST /api/generate-narrative — short headline/narrative/note draft
     POST /api/hot-topics         — weekly top-3 hot-topic analysis
   Holds GEMINI_API_KEY server-side so the browser never sees it.
   Run: node server.js   (then open http://localhost:8787)
   ========================================================================= */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8787;
const GEMINI_MODEL = "gemini-3.6-flash";
const SOURCES_DIR = path.join(ROOT, "data", "sources");
const HOT_TOPIC_FRAMEWORK_PATH = path.join(ROOT, "data", "prompts", "hot-topic-framework.md");

function loadEnv(){
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")){
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))){
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnv();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, body){
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req){
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function slugify(str){
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function loadSourceDoc(countryName){
  const slug = slugify(countryName);
  for (const ext of [".txt", ".md"]){
    const p = path.join(SOURCES_DIR, slug + ext);
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  }
  return null;
}

function extractSources(candidate){
  const chunks = candidate && candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks;
  if (!Array.isArray(chunks)) return [];
  return chunks
    .map(c => c.web && { title: c.web.title, url: c.web.uri })
    .filter(Boolean);
}

function stripFences(text){
  return text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
}

// Search grounding needs a billing-enabled Gemini project; off by default so
// requests don't 429 for keys without it. Flip ENABLE_SEARCH_GROUNDING=true once set up.
function searchGroundingEnabled(){
  return process.env.ENABLE_SEARCH_GROUNDING === "true";
}

async function callGemini(prompt, apiKey, { useJsonMode, useSearchGrounding }){
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const generationConfig = { temperature: 0.4 };
  if (useJsonMode) generationConfig.responseMimeType = "application/json";
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };
  if (useSearchGrounding) body.tools = [{ google_search: {} }];
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Calls Gemini for JSON output, retrying without JSON mode if a model version
// rejects combining it with tools, and extracting text + grounding sources.
async function generateJson(prompt, apiKey, useSearchGrounding){
  let geminiRes = await callGemini(prompt, apiKey, { useJsonMode: true, useSearchGrounding });

  if (geminiRes.status === 400){
    const errBody = await geminiRes.text();
    if (/mime.?type|response_schema|tool/i.test(errBody)){
      geminiRes = await callGemini(prompt, apiKey, { useJsonMode: false, useSearchGrounding });
    } else {
      return { error: { status: 400, message: `Gemini API error (400): ${errBody}` } };
    }
  }

  if (!geminiRes.ok){
    const errText = await geminiRes.text();
    return { error: { status: geminiRes.status, message: `Gemini API error (${geminiRes.status}): ${errText}` } };
  }

  const data = await geminiRes.json();
  const candidate = data && data.candidates && data.candidates[0];
  const text = candidate && candidate.content && candidate.content.parts
    && candidate.content.parts.map(p => p.text || "").join("");

  if (!text){
    return { error: { status: 502, message: "Gemini returned no text (it may have blocked the response)." } };
  }

  let parsed;
  try {
    parsed = JSON.parse(stripFences(text));
  } catch {
    return { error: { status: 502, message: "Gemini response was not valid JSON.", raw: text } };
  }

  return { parsed, sources: extractSources(candidate) };
}

function requireApiKey(res){
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey){
    sendJson(res, 500, {
      error: "GEMINI_API_KEY is not set on the server. Copy .env.example to .env and add a free key from https://aistudio.google.com/apikey, then restart the server.",
    });
    return null;
  }
  return apiKey;
}

async function handleGenerate(req, res){
  let name;
  try {
    ({ name } = JSON.parse((await readBody(req)) || "{}"));
  } catch {
    sendJson(res, 400, { error: "Malformed JSON body." });
    return;
  }
  if (!name || typeof name !== "string"){
    sendJson(res, 400, { error: 'Missing "name" (country name) in request body.' });
    return;
  }

  const apiKey = requireApiKey(res);
  if (!apiKey) return;

  const sourceDoc = loadSourceDoc(name);
  const useSearchGrounding = !sourceDoc && searchGroundingEnabled();

  const prompt = sourceDoc
    ? `You are drafting a short energy-transition narrative for "${name}" in the style of Ember (ember-energy.org) country pages.
Base your answer ONLY on the SOURCE DOCUMENT below — do not use outside knowledge or invent facts not supported by it.

SOURCE DOCUMENT:
"""
${sourceDoc}
"""

Return ONLY valid JSON, no markdown fences, matching exactly this shape:
{"headline": "...", "narrative": "...", "note": "..."}

Rules:
- "headline": one sentence, present tense, the single most striking energy-transition fact from the source document.
- "narrative": 2-3 sentences of context (clean vs fossil generation trend, a notable recent shift), drawn only from the source document.
- "note": one sentence, a secondary interesting fact from the source document.
- If the source document doesn't cover something, leave it out rather than guessing.`
    : `You are drafting a short energy-transition narrative for "${name}" in the style of Ember (ember-energy.org) country pages.
Return ONLY valid JSON, no markdown fences, matching exactly this shape:
{"headline": "...", "narrative": "...", "note": "..."}

Rules:
- "headline": one sentence, present tense, the single most striking energy-transition fact you're confident about for ${name}.
- "narrative": 2-3 sentences of context (clean vs fossil generation trend, a notable recent shift).
- "note": one sentence, a secondary interesting fact.
- No source document is attached for ${name} yet, so this is a first-pass draft that a human will fact-check against real Ember data before publishing. Prefer qualitative language ("a majority", "a growing share") over precise numbers. If you do state a specific number, append " (verify)" right after it.`;

  try {
    const result = await generateJson(prompt, apiKey, useSearchGrounding);
    if (result.error){
      sendJson(res, result.error.status, { error: result.error.message, raw: result.error.raw });
      return;
    }

    const draft = result.parsed;
    if (result.sources.length) draft.sources = result.sources;
    if (sourceDoc) draft.groundedInLocalDoc = true;

    sendJson(res, 200, { draft });
  } catch (err){
    sendJson(res, 500, { error: String((err && err.message) || err) });
  }
}

function isoDateDaysAgo(days){
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function handleHotTopics(req, res){
  let name, startDate, endDate;
  try {
    ({ name, startDate, endDate } = JSON.parse((await readBody(req)) || "{}"));
  } catch {
    sendJson(res, 400, { error: "Malformed JSON body." });
    return;
  }
  if (!name || typeof name !== "string"){
    sendJson(res, 400, { error: 'Missing "name" (country name) in request body.' });
    return;
  }

  const apiKey = requireApiKey(res);
  if (!apiKey) return;

  if (!startDate) startDate = isoDateDaysAgo(7);
  if (!endDate) endDate = isoDateDaysAgo(0);

  const framework = fs.readFileSync(HOT_TOPIC_FRAMEWORK_PATH, "utf8")
    .replace(/\[COUNTRY X\]/g, name)
    .replace(/Country X/g, name)
    .replace(/\[COUNTRY\]/g, name)
    .replace(/\[START DATE\]/g, startDate)
    .replace(/\[END DATE\]/g, endDate);

  const sourceDoc = loadSourceDoc(name);
  // Without either search grounding or a source doc, the model has no way to
  // know what actually happened in the monitoring window — flag that plainly.
  const useSearchGrounding = searchGroundingEnabled();
  const grounded = Boolean(sourceDoc) || useSearchGrounding;

  const sourceBlock = sourceDoc
    ? `CANDIDATE SOURCE MATERIAL for Step 2 (use this as your primary pool of candidate issues; only supplement from general/search knowledge if this material is insufficient to find 5-10 candidates):\n"""\n${sourceDoc}\n"""\n\n`
    : "";

  const prompt = `${sourceBlock}${framework}

Additional output instructions: ignore the "Final output (short form)" markdown template and the ranking table above — instead, return ONLY valid JSON, no markdown fences, matching exactly this shape:
{"issues": [
  {"rank": 1, "headline": "...", "category": "...", "hotnessScore": 0, "issue": "...", "implication": "...", "emberRecommendation": "..."}
]}
Return exactly 3 entries in "issues", ranked #1 to #3, "hotnessScore" out of 100 per the scoring rules above.`;

  try {
    const result = await generateJson(prompt, apiKey, useSearchGrounding);
    if (result.error){
      sendJson(res, result.error.status, { error: result.error.message, raw: result.error.raw });
      return;
    }

    const report = result.parsed;
    report.country = name;
    report.monitoringPeriod = { start: startDate, end: endDate };
    report.grounded = grounded;
    if (!grounded){
      report.warning = "No source document and search grounding is off — this analysis reflects the model's general knowledge, not an actual scan of this week's news. Add a data/sources file or set ENABLE_SEARCH_GROUNDING=true for a real weekly scan.";
    }
    if (result.sources.length) report.sources = result.sources;
    if (sourceDoc) report.groundedInLocalDoc = true;

    sendJson(res, 200, report);
  } catch (err){
    sendJson(res, 500, { error: String((err && err.message) || err) });
  }
}

function serveStatic(req, res){
  let urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.join(ROOT, decodeURIComponent(urlPath));
  if (!filePath.startsWith(ROOT)){
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err){
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/generate-narrative"){
    handleGenerate(req, res).catch(err => sendJson(res, 500, { error: String((err && err.message) || err) }));
    return;
  }
  if (req.method === "POST" && req.url === "/api/hot-topics"){
    handleHotTopics(req, res).catch(err => sendJson(res, 500, { error: String((err && err.message) || err) }));
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Narrative map running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY){
    console.log('No GEMINI_API_KEY found — the narrative-drafting and hot-topics endpoints will error until you add one to .env (see .env.example).');
  }
});
