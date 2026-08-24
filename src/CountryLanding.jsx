import React from "react";

/**
 * CountryLanding
 *
 * The landing view for a single country in the narrative map.
 *
 * Deliberately data-driven: nothing about Vietnam is hardcoded in the markup.
 * The whole architecture rests on claims being reusable across countries, so
 * if this component only rendered Vietnam it would quietly contradict the model
 * it is meant to serve. Swap `data` and you have Indonesia.
 *
 * Personalisation happens upstream. The caller is responsible for filtering
 * `leversHeld` / `leversElsewhere` and selecting `stats` against the signed-in
 * user's institutional mandate — this component just renders what it is given.
 */

/* ---------------------------------------------------------------- example payload */

export const vietnam = {
  country: "Vietnam",
  role: "Ministry planner · capacity planning",
  tier: "Deep dossier",
  archetype: "Fast-growth builder",
  horizon: "Horizon 5–10 years",

  stats: [
    { label: "Clean share", value: "43%" },
    { label: "Coal share", value: "46%" },
    { label: "Demand growth, 5yr", value: "8.4%" },
    { label: "Capacity outside registry", value: "est. 2–4 GW" },
  ],

  narratives: [
    {
      id: "vn-rooftop-registry",
      title: "Rooftop boom, then an abrupt stop",
      code: "PROCESS",
      reviewed: "Reviewed 6 weeks ago",
      stale: false,
      official: {
        text:
          "Registered rooftop capacity plateaued once the incentive window closed. New connections in the registry are negligible.",
        sources: ["verified"],
      },
      ground: {
        text:
          "Panel imports and installer activity continued through the plateau. Commercial self-consumption appears to have moved outside the registration channel.",
        sources: ["imports", "disclosures"],
      },
      implication:
        "Your plan baseline assumes distributed capacity stopped growing. It may have kept growing unregistered — which shifts both the demand forecast and the southern reserve margin.",
      alsoAffects: ["Pakistan", "Philippines", "India"],
    },
    {
      id: "vn-southern-curtailment",
      title: "Curtailment concentrated in the south",
      code: "COORD",
      reviewed: "Review overdue · data moved",
      stale: true,
      official: {
        text:
          "National curtailment is reported in low single digits, within the range assumed by the plan.",
        sources: ["verified"],
      },
      ground: {
        text:
          "Developer settlement disputes and plant-level output records point to materially higher losses in southern provinces.",
        sources: ["ad-hoc", "disputes"],
      },
      implication:
        "A national average conceals a regional constraint. Whether southern capacity is worth adding depends on the provincial figure, not the national one.",
      alsoAffects: ["India", "China"],
    },
    {
      id: "vn-thermal-dispatch",
      title: "Plan revision locks in thermal dispatch",
      code: "DESIGN",
      reviewed: "Reviewed 2 weeks ago",
      stale: false,
      official: {
        text:
          "The revised plan sets a clean capacity target above prior versions and is on track against it.",
        sources: ["verified"],
      },
      ground: {
        text:
          "Contracted thermal terms commit dispatch priority regardless of how much clean capacity is installed.",
        sources: ["contracts", "ground"],
      },
      implication:
        "The capacity target can be met in full while generation share moves far less than the plan implies. The binding variable is dispatch, and it sits in contracts rather than in the plan.",
      alsoAffects: ["Bangladesh", "Philippines", "Indonesia"],
    },
  ],

  leversHeld: [
    { lever: "Plan revision", instrument: "Cycle and capacity targets" },
    { lever: "Registration rules", instrument: "Self-consumption threshold" },
    { lever: "Direct purchase framework", instrument: "Scope and eligibility" },
  ],

  leversElsewhere: [
    { lever: "Dispatch priority", holder: "State utility" },
    { lever: "Provincial permitting", holder: "Provincial authorities" },
    { lever: "Contract renegotiation", holder: "Finance ministry" },
  ],
};

/* ---------------------------------------------------------------- small pieces */

function Chip({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    accent: "bg-teal-50 text-teal-800",
    warn: "bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-[11px] leading-4 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2.5">
      <p className="text-xs leading-tight text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-medium tabular-nums text-slate-900">
        {value}
      </p>
    </div>
  );
}

/**
 * The paired columns are the signature of this page. Official record and ground
 * signal share a baseline but not a weight: the institutional record sits flat
 * and grey, the ground signal carries a teal rule down its left edge. The seam
 * between them is the product thesis, so it is the one place worth spending
 * visual emphasis — everything else on the page stays quiet.
 */
function Narrative({ n }) {
  return (
    <article className="border-t border-slate-200 py-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-[15px] font-medium text-slate-900">{n.title}</h3>
        <Chip tone="warn">{n.code}</Chip>
        <span
          className={`text-xs ${n.stale ? "text-rose-600" : "text-slate-400"}`}
        >
          {n.reviewed}
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-slate-50 px-3 py-3">
          <p className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            Official record
            {n.official.sources.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </p>
          <p className="text-[13px] leading-relaxed text-slate-700">
            {n.official.text}
          </p>
        </div>

        <div className="rounded-md border-l-2 border-teal-600 bg-teal-50/60 px-3 py-3">
          <p className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-teal-700">
            Ground signal
            {n.ground.sources.map((s) => (
              <Chip key={s} tone="accent">
                {s}
              </Chip>
            ))}
          </p>
          <p className="text-[13px] leading-relaxed text-teal-900">
            {n.ground.text}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-slate-800">
        {n.implication}
      </p>

      {n.alsoAffects?.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Also affects {n.alsoAffects.join(", ")}
        </p>
      )}
    </article>
  );
}

function LeverColumn({ heading, items, muted = false }) {
  return (
    <div>
      <h4 className="mb-2 text-[13px] text-slate-500">{heading}</h4>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.lever} className="text-[13px] leading-snug">
            <span className={muted ? "text-slate-600" : "text-slate-900"}>
              {it.lever}
            </span>
            <span className="text-slate-400"> — {it.instrument ?? it.holder}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- page */

export default function CountryLanding({ data = vietnam, onOpenDiagnostic, onCompare }) {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-5 py-5 font-sans sm:px-7 sm:py-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-slate-900">
            {data.country}
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">{data.role}</p>
        </div>
        <div className="text-right">
          <span className="inline-block rounded bg-teal-50 px-2.5 py-1 text-xs text-teal-800">
            {data.tier}
          </span>
          <p className="mt-1.5 text-xs text-slate-400">
            {data.archetype} · {data.horizon}
          </p>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {data.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <h2 className="mt-6 text-[13px] text-slate-500">On your board</h2>
      <div>
        {data.narratives.map((n) => (
          <Narrative key={n.id} n={n} />
        ))}
      </div>

      <div className="grid gap-6 border-t border-slate-200 pt-4 sm:grid-cols-2">
        <LeverColumn heading="Levers you hold" items={data.leversHeld} />
        <LeverColumn
          heading="Outside your mandate"
          items={data.leversElsewhere}
          muted
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenDiagnostic?.(data.narratives[1].id)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Open diagnostic
        </button>
        <button
          type="button"
          onClick={() => onCompare?.("distributed-solar")}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Compare across countries
        </button>
      </div>
    </div>
  );
}
