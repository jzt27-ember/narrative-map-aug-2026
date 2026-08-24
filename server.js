/* =========================================================================
   Local dev server + Gemini proxy.
   Serves the static site and exposes POST /api/generate-narrative, which
   holds GEMINI_API_KEY server-side so the browser never sees it.
   Run: node server.js   (then open http://localhost:8787)
   ========================================================================= */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8787;
const GEMINI_MODEL = "gemini-2.5-flash";

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

async function handleGenerate(req, res){
  let body = "";
  req.on("data", chunk => { body += chunk; });
  req.on("end", async () => {
    let name;
    try {
      ({ name } = JSON.parse(body || "{}"));
    } catch {
      sendJson(res, 400, { error: "Malformed JSON body." });
      return;
    }
    if (!name || typeof name !== "string"){
      sendJson(res, 400, { error: 'Missing "name" (country name) in request body.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey){
      sendJson(res, 500, {
        error: "GEMINI_API_KEY is not set on the server. Copy .env.example to .env and add a free key from https://aistudio.google.com/apikey, then restart the server.",
      });
      return;
    }

    const prompt = `You are drafting a short energy-transition narrative for "${name}" in the style of Ember (ember-energy.org) country pages.
Return ONLY valid JSON, no markdown fences, matching exactly this shape:
{"headline": "...", "narrative": "...", "note": "..."}

Rules:
- "headline": one sentence, present tense, the single most striking energy-transition fact you're confident about for ${name}.
- "narrative": 2-3 sentences of context (clean vs fossil generation trend, a notable recent shift).
- "note": one sentence, a secondary interesting fact.
- No source documents are attached yet, so this is a first-pass draft that a human will fact-check against real Ember data before publishing. Prefer qualitative language ("a majority", "a growing share") over precise numbers. If you do state a specific number, append " (verify)" right after it.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
        }),
      });

      if (!geminiRes.ok){
        const errText = await geminiRes.text();
        sendJson(res, geminiRes.status, { error: `Gemini API error (${geminiRes.status}): ${errText}` });
        return;
      }

      const data = await geminiRes.json();
      const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
        && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
        && data.candidates[0].content.parts[0].text;

      if (!text){
        sendJson(res, 502, { error: "Gemini returned no text (it may have blocked the response)." });
        return;
      }

      let draft;
      try {
        draft = JSON.parse(text);
      } catch {
        sendJson(res, 502, { error: "Gemini response was not valid JSON.", raw: text });
        return;
      }

      sendJson(res, 200, { draft });
    } catch (err){
      sendJson(res, 500, { error: String((err && err.message) || err) });
    }
  });
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
    handleGenerate(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Narrative map running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY){
    console.log('No GEMINI_API_KEY found — the "Draft narrative with AI" button will error until you add one to .env (see .env.example).');
  }
});
