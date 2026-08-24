import React, { useState } from "react";
import DivergenceMap from "./DivergenceMap.jsx";
import CountryLanding, { vietnam } from "./CountryLanding.jsx";
import { thailand } from "./data/thailand.js";

const CARDS = { TH: thailand, VN: vietnam };

export default function App() {
  const [view, setView] = useState("landing");
  const [selected, setSelected] = useState("TH");

  if (view === "detail" && CARDS[selected]) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-3xl px-0 sm:px-0 mb-3">
          <button
            type="button"
            onClick={() => setView("landing")}
            className="text-[13px] text-slate-500 hover:text-slate-900 transition"
          >
            ← Back to map
          </button>
        </div>
        <CountryLanding data={CARDS[selected]} />
      </div>
    );
  }

  return (
    <DivergenceMap
      cards={CARDS}
      initialSel="TH"
      onOpenDossier={(code) => { setSelected(code); setView("detail"); }}
    />
  );
}
