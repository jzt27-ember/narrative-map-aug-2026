/* =========================================================================
   MAP RENDERING
   Reads country data from window NARRATIVES (see data/narratives.js).
   ========================================================================= */
const svg = d3.select("#map-svg");
const width = 960, height = 500;
const projection = d3.geoNaturalEarth1().scale(175).translate([width / 2, height / 2 + 20]);
const path = d3.geoPath(projection);

/* Diverging scale using Ember's own category colours:
   fossil-dark -> fossil-pale (neutral midpoint) -> renewables-dark */
const emberScale = d3.interpolateRgbBasis(["#553E39", "#B8B0AF", "#0B6638"]);
function colorFor(clean){
  const t = Math.max(0, Math.min(1, (clean - 15) / (90 - 15)));
  return emberScale(t);
}

let selectedId = null;

const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

d3.json(WORLD_ATLAS_URL).then(topology => {
  document.getElementById("loading-msg").style.display = "none";
  const countries = topojson.feature(topology, topology.objects.countries).features;

  const g = svg.append("g");

  g.selectAll("path.country-shape")
    .data(countries)
    .join("path")
    .attr("class", d => {
      const id = +d.id;
      return "country-shape " + (NARRATIVES[id] ? "lit" : "unlit");
    })
    .attr("id", d => "country-" + d.id)
    .attr("d", path)
    .attr("fill", d => {
      const info = NARRATIVES[+d.id];
      return info ? colorFor(info.clean) : null;
    })
    .attr("tabindex", d => NARRATIVES[+d.id] ? 0 : -1)
    .attr("role", d => NARRATIVES[+d.id] ? "button" : null)
    .attr("aria-label", d => {
      const info = NARRATIVES[+d.id];
      return info ? `${info.name}: ${info.clean}% clean electricity. Show narrative.` : null;
    })
    .on("click", (event, d) => selectCountry(+d.id, d.properties && d.properties.name))
    .on("keydown", (event, d) => {
      if (event.key === "Enter" || event.key === " "){
        event.preventDefault();
        selectCountry(+d.id, d.properties && d.properties.name);
      }
    });

  buildQuickJump();
}).catch(err => {
  document.getElementById("loading-msg").textContent = "Couldn't load world map geometry (offline, or the CDN/raw.githubusercontent.com source is unreachable). The narrative panel and quick-jump list below still work.";
  buildQuickJump();
  console.error(err);
});

/* =========================================================================
   QUICK-JUMP LIST (keyboard/screen-reader friendly + works if map fails)
   ========================================================================= */
function buildQuickJump(){
  const container = document.getElementById("quickjump");
  const ids = Object.keys(NARRATIVES).sort((a, b) => NARRATIVES[a].name.localeCompare(NARRATIVES[b].name));
  ids.forEach(id => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = NARRATIVES[id].name;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => selectCountry(+id));
    btn.id = "jump-" + id;
    container.appendChild(btn);
  });
}

/* =========================================================================
   PANEL RENDERING
   ========================================================================= */
function selectCountry(id, countryName){
  selectedId = id;

  d3.selectAll(".country-shape").classed("selected", false);
  d3.select("#country-" + id).classed("selected", true);

  document.querySelectorAll("#quickjump button").forEach(b => b.setAttribute("aria-pressed", "false"));
  const jumpBtn = document.getElementById("jump-" + id);
  if (jumpBtn) jumpBtn.setAttribute("aria-pressed", "true");

  const info = NARRATIVES[id];
  const emptyEl = document.getElementById("panel-empty");
  const contentEl = document.getElementById("panel-content");
  emptyEl.style.display = "none";
  contentEl.classList.add("active");

  if (!info){
    const name = countryName || `Country ${id}`;
    contentEl.innerHTML = `
      <div class="panel-missing">
        <span class="badge-tbd">Not in this sprint yet</span>
        <h3>No narrative loaded</h3>
        <p>${escapeHtml(name)} isn't wired into the demo dataset. Add an entry to the <code>NARRATIVES</code> object (keyed by ISO numeric country code) to light it up on the map.</p>
        <button type="button" class="btn-generate" id="btn-generate">Draft narrative with AI (Gemini)</button>
        <div id="generate-result"></div>
      </div>
    `;
    document.getElementById("btn-generate").addEventListener("click", () => runGenerate(name));
    return;
  }

  const reportHtml = info.report
    ? `<a href="${info.report.url}" target="_blank" rel="noopener">${info.report.label}</a>`
    : "";

  contentEl.innerHTML = `
    <div class="panel-kicker">${info.name}</div>
    <h3>${info.headline}</h3>

    <div class="stat-row">
      <div class="stat clean"><span class="num">${info.clean}%</span><span class="lbl">Clean</span></div>
      <div class="stat mix"><span class="num">${info.windSolar}%</span><span class="lbl">Wind+Solar</span></div>
      <div class="stat fossil"><span class="num">${info.fossil}%</span><span class="lbl">Fossil</span></div>
    </div>

    <div class="mix-bar" aria-hidden="true">
      <span style="width:${info.clean}%; background:var(--renew-mid);"></span>
      <span style="width:${info.fossil}%; background:var(--fossil-mid);"></span>
    </div>

    <p class="narrative">${info.narrative}</p>

    <div class="field-note">
      ${info.note}
      <cite>— paraphrased from Ember country analysis</cite>
    </div>

    <div class="panel-links">
      <a href="${info.link}" target="_blank" rel="noopener">Full country page on ember-energy.org</a>
      ${reportHtml}
    </div>
  `;
}

/* =========================================================================
   AI-ASSISTED DRAFTING (Gemini, via api/llm.js -> server.js proxy)
   Drafts prose only — no fabricated stats. Always unverified until a human
   checks it against real Ember data and adds it to data/narratives.js.
   ========================================================================= */
function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function runGenerate(name){
  const resultEl = document.getElementById("generate-result");
  const btn = document.getElementById("btn-generate");
  if (!resultEl || !btn) return;

  btn.disabled = true;
  btn.textContent = "Drafting…";
  resultEl.innerHTML = "";

  try {
    const draft = await generateNarrative({ name });
    const draftJson = JSON.stringify(draft, null, 2);
    resultEl.innerHTML = `
      <div class="ai-draft">
        <span class="badge-ai">AI draft — unverified, review before publishing</span>
        <h4>${escapeHtml(draft.headline || "")}</h4>
        <p class="narrative">${escapeHtml(draft.narrative || "")}</p>
        <div class="field-note">${escapeHtml(draft.note || "")}</div>
        <p class="hint">No source documents are attached yet, so treat this as a starting point: fact-check against Ember's country page, fill in real clean/wind+solar/fossil figures, then paste into <code>data/narratives.js</code>.</p>
        <pre class="draft-json">${escapeHtml(draftJson)}</pre>
      </div>
    `;
  } catch (err){
    resultEl.innerHTML = `<p class="error-msg">Couldn't generate a draft: ${escapeHtml(err.message)}</p>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Draft narrative with AI (Gemini)";
  }
}
