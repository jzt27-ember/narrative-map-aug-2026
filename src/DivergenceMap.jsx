import React, { useEffect, useRef, useState } from "react";
import { TILES, COLS, ROWS } from "./data/asiaTiles.js";
import { THEMES, D, STATS_ONLY, CH, CHL } from "./data/asiaDossiers.js";
import "./divergence.css";

// Tile geometry: each country is a fixed-size square rather than a projected
// shape, so there is nothing on the map that draws a border.
const TILE = 46, GAP = 6, PAD = 10;
const SIZE = TILE - GAP;
const VB_W = COLS * TILE + PAD * 2, VB_H = ROWS * TILE + PAD * 2;
function tx(col) { return PAD + col * TILE; }
function ty(row) { return PAD + row * TILE; }

// Choropleth fill for the base map — deliberately NOT built from Ember's highlight
// tokens (amber/orange), which are reserved for interactive/emphasis states.
// Uses the neutral-to-fossil-brown family instead, distinct from the renewables-green
// scale the original clean-electricity map used.
function ramp(v) {
  const s = [[0.05, "#EDEEF1"], [0.30, "#D9D3CE"], [0.50, "#B8B0AF"], [0.70, "#857572"], [1.01, "#553E39"]];
  for (const [t, c] of s) if (v < t) return c;
  return "#553E39";
}
// Paired with ramp() above — light fills read best with ink text, the two
// darkest steps of the ramp need a light label instead.
function tileInk(v) { return v < 0.5 ? "var(--ink)" : "#F7F2EE"; }
function divOf(code) { return D[code] ? D[code].div : (STATS_ONLY[code] ?? 0.1); }

export default function DivergenceMap({ cards = {}, initialSel = "TH", onOpenDossier }) {
  const svgRef = useRef(null);
  const asideRef = useRef(null);
  const [role, setRole] = useState("planner");
  const [theme, setTheme] = useState("all");
  const selRef = useRef(initialSel);
  const stageRef = useRef({});
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((n) => n + 1);

  function hasTheme(code) {
    if (theme === "all") return true;
    return D[code] ? D[code].narr.some((n) => n.themes.includes(theme)) : false;
  }
  function isLive(code) { return !!D[code] || !!cards[code]; }

  function drawMap() {
    const svg = svgRef.current;
    if (!svg) return;
    let h = "";
    for (const code in TILES) {
      const g = TILES[code], live = isLive(code), dim = !hasTheme(code);
      const fill = ramp(divOf(code));
      h += `<rect x="${tx(g.col)}" y="${ty(g.row)}" width="${SIZE}" height="${SIZE}" rx="6" fill="${fill}" data-c="${code}"
        class="tile ${live ? "live" : ""} ${dim ? "dim" : ""} ${code === selRef.current && !dim ? "sel" : ""}"
        ${live ? `tabindex="0" role="button" aria-label="${g.name}"` : ""}></rect>
        <text x="${tx(g.col) + SIZE / 2}" y="${ty(g.row) + SIZE / 2}" class="tile-lbl ${dim ? "dim" : ""}"
        style="fill:${tileInk(divOf(code))}" pointer-events="none">${code}</text>`;
    }
    for (const code in D) {
      const g = TILES[code];
      if (g && hasTheme(code)) {
        const cx = tx(g.col) + SIZE - 6, cy = ty(g.row) + 6;
        h += `<rect class="dot" x="${cx - 2.6}" y="${cy - 2.6}" width="5.2" height="5.2" rx="1" fill="#1B2236" opacity=".6"/>`;
      }
    }
    svg.innerHTML = h;
    svg.querySelectorAll("rect.live").forEach((p) => {
      const c = p.dataset.c;
      p.addEventListener("click", () => { selRef.current = c; stageRef.current = {}; drawMap(); drawPanel(); });
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); p.click(); } });
      p.addEventListener("mousemove", (e) => {
        const t = svg.parentElement.querySelector(".tip");
        if (!t) return;
        const r = svg.getBoundingClientRect();
        const label = D[c] ? (D[c].tier === "deep" ? "deep dossier" : "standard") : (cards[c] ? "full dossier" : "profile");
        t.textContent = TILES[c].name + " · " + label;
        t.style.left = (e.clientX - r.left + 12) + "px";
        t.style.top = (e.clientY - r.top - 30) + "px";
        t.style.opacity = 1;
      });
      p.addEventListener("mouseleave", () => {
        const t = svg.parentElement.querySelector(".tip");
        if (t) t.style.opacity = 0;
      });
    });
  }

  function gapBlock(g) {
    const max = Math.max(g.official, g.ground);
    return `<div class="gap">
      <div class="gaprow"><span class="gaplab">${g.olab}</span><span class="gapbar"><i style="width:${g.official / max * 100}%;background:var(--official)"></i></span><span class="gapval mono">${g.official}</span></div>
      <div class="gaprow"><span class="gaplab">${g.glab}</span><span class="gapbar"><i style="width:${g.ground / max * 100}%;background:var(--ground)"></i></span><span class="gapval mono">${g.ground}</span></div>
      <p class="gapnote">${g.note}</p>
      <p style="font-size:11px;color:var(--faint);margin-top:2px">${g.unit}</p>
    </div>`;
  }

  function chainBlock(n, ni) {
    const cur = stageRef.current[ni] ?? n.chain.findIndex((s) => s[2] === "bad");
    const rows = n.chain.map((s, i) => {
      const bar = s[1] === 0 ? '<i class="hatch"></i>' : `<i style="width:${s[1]}%;background:${CH[s[2]]}"></i>`;
      return `<div class="stg ${i === cur ? "on" : ""}" data-n="${ni}" data-s="${i}" tabindex="0" role="button">
        <span class="nm">${s[0]}</span><span class="trk">${bar}</span><span class="pc mono">${s[1]}%</span></div>`;
    }).join("");
    const s = n.chain[cur];
    const code = s[3] === "—" ? "" : `<span class="code mono">${s[3]}</span>`;
    const lv = (n.lev[role] || []).map((l) =>
      `<div class="lev ${l[2] ? "" : "out"}"><span class="mk"></span><div>${l[0]}<div class="who">${l[1]}</div></div></div>`).join("");
    return `<div class="chain">
      <p class="eyebrow-label" style="margin-bottom:7px">Where it breaks</p>
      ${rows}
      <div class="detail"><h5>${s[0]} <span style="color:var(--faint);font-weight:400;font-size:12px">· ${CHL[s[2]]}</span> ${code}</h5>
        <p>${s[4]}</p><div class="chips">${s[5].map((e) => `<span class="chip">${e}</span>`).join("")}</div></div>
      <p class="eyebrow-label" style="margin:16px 0 2px">Levers</p>${lv || '<p style="font-size:13px;color:var(--muted);padding-top:8px">No levers mapped for this role.</p>'}
    </div>`;
  }

  function drawPanel() {
    const p = asideRef.current;
    if (!p) return;
    const sel = selRef.current;

    if (theme !== "all") {
      const rows = Object.keys(D).filter(hasTheme).map((c) => {
        const n = D[c].narr.find((x) => x.themes.includes(theme));
        return `<div class="row" data-c="${c}"><span class="c">${D[c].name}</span><span class="g">${n.t} · <span class="mono">${n.code}</span></span></div>`;
      }).join("");
      p.innerHTML = `<div class="pad"><p class="eyebrow-label">Theme view</p>
        <h2 style="font-size:21px;font-weight:600;letter-spacing:-.02em;margin-top:4px">${THEMES[theme]}</h2>
        <p style="font-size:13.5px;color:var(--muted);margin-top:7px">Countries carrying this narrative. The same claims assemble differently in each.</p>
        <div class="themelist" style="margin-top:14px">${rows}</div></div>
        <footer>Selecting a country returns to the dossier view.</footer>`;
      p.querySelectorAll(".row").forEach((r) => r.addEventListener("click", () => {
        selRef.current = r.dataset.c; setTheme("all");
        stageRef.current = {}; drawMap(); drawPanel();
      }));
      return;
    }

    // Real, source-grounded dossier available — lightweight preview + explicit hand-off.
    if (cards[sel]) {
      const cd = cards[sel];
      const st = cd.stats.slice(0, 4).map((s) => `<div class="stat"><div class="k">${s.label}</div><div class="v mono">${s.value}</div></div>`).join("");
      p.innerHTML = `<div class="pad">
          <div class="dhead"><div><h2>${cd.country}</h2>
            <p class="meta">${cd.archetype}</p></div>
            <span class="tier deep">${cd.tier}</span></div>
          <div class="stats">${st}</div>
          <p style="font-size:11.5px;color:var(--faint);margin-top:7px">Figures grounded in named public sources — see the full dossier.</p>
          <div class="preview-cta">
            <p class="eyebrow-label">Full dossier available</p>
            <p style="font-size:13.5px;color:var(--muted);margin-top:6px">${cd.narratives.length} official-record-vs-ground-signal narratives, with levers held vs. outside your mandate.</p>
            <button type="button" class="btn-open" id="open-dossier">Open full dossier →</button>
          </div>
        </div>
        <footer>This preview uses only figures traceable to a named source. Prototype for the rest of the map — all other figures are illustrative placeholders, not queried from verified data.</footer>`;
      const btn = p.querySelector("#open-dossier");
      if (btn) btn.addEventListener("click", () => onOpenDossier && onOpenDossier(sel));
      return;
    }

    const d = D[sel];
    if (!d) { p.innerHTML = `<div class="pad"><p class="eyebrow-label">No dossier yet</p></div>`; return; }
    const st = d.stats[role].map((s) => `<div class="stat"><div class="k">${s[0]}</div><div class="v mono">${s[1]}</div></div>`).join("");
    const nn = d.narr.map((n, i) => `<details class="narr" ${i === 0 ? "open" : ""}><summary>
        <div class="ntop"><span class="ntitle">${n.t}</span><span class="code mono">${n.code}</span></div>
        <p class="nwhy">${n.why}</p>${gapBlock(n.gap)}</summary>${chainBlock(n, i)}</details>`).join("");
    const pr = (d.peers[role] || []).map((x) => `<div class="lev"><span class="mk" style="background:var(--official)"></span><div>${x}</div></div>`).join("");
    p.innerHTML = `<div class="pad">
        <div class="dhead"><div><h2>${d.name}</h2>
          <p class="meta">${d.arch} · reviewed ${d.rev}</p></div>
          <span class="tier ${d.tier}">${d.tier === "deep" ? "Deep dossier" : "Standard"}</span></div>
        <div class="stats">${st}</div>
        <p style="font-size:11.5px;color:var(--faint);margin-top:7px">Indicators selected for the ${role === "planner" ? "planning" : "regulatory"} mandate.</p>
        <p class="eyebrow-label" style="margin-top:22px">On your board</p>${nn}
        <p class="eyebrow-label" style="margin-top:22px">Compared with</p>${pr}
      </div>
      <footer>Filled markers are levers this role can sign. Hollow markers sit with another body.<br>
        Prototype — all figures are illustrative placeholders, not queried from verified data.</footer>`;
    p.querySelectorAll(".stg").forEach((s) => {
      const go = () => { stageRef.current[+s.dataset.n] = +s.dataset.s; drawPanel(); };
      s.addEventListener("click", go);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  useEffect(() => { drawMap(); drawPanel(); }, [theme, role]);
  useEffect(() => { drawMap(); drawPanel(); }, []);

  return (
    <div className="divergence-app">
      <div className="eyebrow-bar">
        <div className="eyebrow"><span className="dot"></span> Data Tool Sprint — internal prototype</div>
      </div>
      <header>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <b>Ember <span className="brand-product">Divergence</span></b>
          <span>Asia energy narrative map</span>
        </div>
        <div className="spacer"></div>
        <div className="ctl">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
            {Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="ctl">
          <label>Viewing as</label>
          <div className="seg">
            <button type="button" aria-pressed={role === "planner"} onClick={() => { setRole("planner"); stageRef.current = {}; }}>Ministry planner</button>
            <button type="button" aria-pressed={role === "regulator"} onClick={() => { setRole("regulator"); stageRef.current = {}; }}>Regulator</button>
          </div>
        </div>
      </header>
      <main>
        <div className="mapwrap">
          <svg id="map" ref={svgRef} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" role="img"
            aria-label="Tile grid of Asia, one square per country, shaded by divergence between official statistics and ground evidence"></svg>
          <div className="legend">
            <h4>Divergence index</h4>
            <div className="legend-scale">
              <span>Aligned</span>
              <div className="legend-bar" aria-hidden="true"></div>
              <span>Diverging</span>
            </div>
            <p>How far the official record sits from ground evidence. Coloured countries have a profile; click a highlighted one for the full dossier.</p>
            <p className="legend-note">Schematic tile grid, not a projected map — position is approximate, and there are no borders to dispute.</p>
          </div>
          <div className="tip"></div>
        </div>
        <aside ref={asideRef}></aside>
      </main>
    </div>
  );
}
