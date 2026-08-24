/* Generated with Gemini (gemini-3.6-flash), grounded in data/sources/thailand.md.
   Every official/ground claim traces to a real named source in that document —
   see data/sources/thailand.md for the underlying citations. */
export const thailand = {
  country: "Thailand",
  role: "Southeast Asian Power & Industrial Center",
  tier: "Deep dossier",
  archetype: "Gas-Dependent Industrial Exporter",
  horizon: "PDP 2026–2050 Transition Horizon",

  stats: [
    { label: "Gas Share of Power Generation (2024)", value: "68%" },
    { label: "PDP 2050 Clean Electricity Target", value: "60%" },
    { label: "State Fuel Fund Deficit (April 2026)", value: "~50 Billion Baht" },
    { label: "Clean Energy Investment (2024)", value: "$1.18 Billion" },
  ],

  narratives: [
    {
      id: "clean-power-target-vs-fossil-baseline",
      title: "Clean Electricity Targets vs. Gas-Dominant Baseline",
      code: "METRIC",
      reviewed: "Reviewed this week",
      stale: false,
      official: {
        text:
          "The Energy Ministry established a target of 60% clean electricity under the PDP 2026–2050 draft while advancing the national net-zero target year forward to 2050.",
        sources: ["Bangkok Post", "The Nation Thailand"],
      },
      ground: {
        text:
          "Gas accounted for ~68% of power generation and coal 17% in 2024, with declining domestic gas pushing LNG import reliance to 29%, while CCPI ranks Thailand low on climate policy due to continued fossil dependency.",
        sources: ["BloombergNEF", "CCPI"],
      },
      implication:
        "Long-term decarbonization targets face severe structural drag from existing natural gas dependence and import vulnerabilities.",
      alsoAffects: [],
    },
    {
      id: "solar-expansion-vs-regulatory-barriers",
      title: "Solar Incentive Push vs. Market & Regulatory Frictions",
      code: "CAPACITY",
      reviewed: "Reviewed this week",
      stale: false,
      official: {
        text:
          "Energy authorities are promoting solar energy through personal income tax deductions of up to 200,000 baht for rooftop installations and licensing 449 renewable projects expected to attract up to $2.61 billion in investment.",
        sources: ["Bangkok Post", "The Nation Thailand"],
      },
      ground: {
        text:
          "Thailand has utilized only ~1% of its technical solar potential, while expert analysis points to obsolete regulatory clauses, insufficient grid infrastructure, and market players operating in silos.",
        sources: ["Ember Energy", "Carbon Trust"],
      },
      implication:
        "Financial incentives alone will fail to deploy available solar potential without modernizing grid infrastructure and updating regulatory frameworks.",
      alsoAffects: [],
    },
    {
      id: "net-zero-push-vs-fossil-hub-ambitions",
      title: "Net-Zero Climate Framing vs. Parallel Fossil Hub Expansion",
      code: "DESIGN",
      reviewed: "Reviewed this week",
      stale: false,
      official: {
        text:
          "Thailand frames its draft PDP power sector revamp as essential to achieving international NDC emissions pledges reaffirmed at UN climate summits.",
        sources: ["Bangkok Post"],
      },
      ground: {
        text:
          "Thailand is actively positioning itself as an ASEAN LNG trading hub at Gastech 2026 and advancing the Land Bridge project featuring crude oil storage facilities and cross-coastline pipelines.",
        sources: ["The Nation Thailand"],
      },
      implication:
        "Energy security pressures triggered by global crude volatility are driving concurrent capital investment into major fossil trade infrastructure alongside net-zero goals.",
      alsoAffects: [],
    },
  ],

  leversHeld: [
    {
      lever: "Power Development Plan (PDP 2026-2050) Formulation",
      instrument: "Energy Policy and Planning Office (EPPO) and Energy Ministry setting clean energy percentage targets and technology mix.",
    },
    {
      lever: "Renewable Licensing & Power Purchase Regulatory Frameworks",
      instrument: "Energy Regulatory Commission (ERC) approving renewable project licenses and implementing Direct PPA frameworks.",
    },
  ],

  leversElsewhere: [
    { lever: "Rooftop Solar Personal Income Tax Deductions", holder: "Ministry of Finance / Revenue Department" },
    { lever: "Low-Carbon Cities Municipal Financing", holder: "World Bank ($200 million Development Project funding)" },
  ],
};
