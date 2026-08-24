/* =========================================================================
   NARRATIVES
   Keyed by ISO 3166-1 numeric country code (matches world-atlas topojson id).
   Swap this object for a live data source when this graduates past sprint demo.
   Source: paraphrased from ember-energy.org country pages, Aug 2026.
   ========================================================================= */
const NARRATIVES = {
  840: { // United States
    name: "United States",
    headline: "Solar is meeting most of the US's new electricity demand as policy support wavers.",
    clean: 43, windSolar: 19, fossil: 57,
    narrative: "Solar was the single biggest source of new US generation in 2025, covering the majority of the country's rising electricity demand even as federal support for clean energy grew less certain. Wind and solar together overtook coal for the first time in 2024, though gas still supplies about two-fifths of the mix.",
    note: "Renewable build-out kept going through 2025 regardless of shifting policy signals — Texas led on solar growth, Florida's solar growth outpaced demand growth outright.",
    link: "https://ember-energy.org/countries-and-regions/united-states-of-america",
    report: { label: "US Electricity 2025 — Special Report", url: "https://ember-energy.org/latest-insights/us-electricity-2025-special-report" }
  },
  826: { // United Kingdom
    name: "United Kingdom",
    headline: "Renewables have overtaken fossil fuels as the UK's largest source of power.",
    clean: 64, windSolar: 36, fossil: 36,
    narrative: "Low-carbon power overtook fossil fuels as the UK's largest source of generation, led by one of Europe's biggest offshore wind fleets. Coal has been phased out entirely, but the UK increasingly imports gas as North Sea reserves decline — even as power-sector emissions per person sit 30% below the EU average.",
    note: "Ember's UK team frames the next phase as reducing import reliance for heat and transport, not just electricity.",
    link: "https://ember-energy.org/countries-and-regions/united-kingdom",
    report: null
  },
  276: { // Germany
    name: "Germany",
    headline: "Germany led EU wind and solar generation in 2025, but stayed the bloc's top coal producer.",
    clean: 59, windSolar: 45, fossil: 41,
    narrative: "Germany generated more wind and solar power than any other EU country in 2025 — over a quarter of the bloc's total — with solar output overtaking gas for the first time. It remains the EU's largest coal producer, and Ember's analysis suggests its coal-mine methane emissions run far above what's officially reported.",
    note: "Wind and solar have grown from under 2% of generation in 2000 to 45% today, alongside a 2023 nuclear exit.",
    link: "https://ember-energy.org/countries-and-regions/germany",
    report: null
  },
  156: { // China
    name: "China",
    headline: "China's coal generation fell year-on-year for the first time in a decade.",
    clean: 42, windSolar: 22, fossil: 58,
    narrative: "China's coal-fired output fell year-on-year for the first time since 2015, even as solar generation jumped 40%. Ember reads this as an early signal the country could reach peak fossil-fuel use by 2030 — a shift that would reshape the outlook for global fossil demand given China's scale.",
    note: "China is also the world's largest coal-mine methane emitter, accounting for roughly three-quarters of the global total.",
    link: "https://ember-energy.org/countries-and-regions/china",
    report: { label: "China Energy Transition Review 2025", url: "https://ember-energy.org/latest-insights/china-energy-transition-review-2025" }
  },
  356: { // India
    name: "India",
    headline: "India became the world's fourth-largest generator of clean electricity in 2025.",
    clean: 27, windSolar: 14, fossil: 73,
    narrative: "India overtook France and Canada in 2025 to become the world's fourth-largest generator of clean electricity, and every unit of new demand that year was met by clean sources rather than coal. Coal still supplies nearly three-quarters of the country's power overall, and India is scaling non-fossil capacity toward a 2030 target.",
    note: "By the end of 2025, India had installed 258 GW of renewables capacity, en route to a 500 GW goal.",
    link: "https://ember-energy.org/countries-and-regions/india",
    report: null
  },
  36: { // Australia
    name: "Australia",
    headline: "Australia has the highest solar generation per person of any country tracked.",
    clean: 39, windSolar: 33, fossil: 61,
    narrative: "Australia has the highest solar generation per person in the world — more than six times the global average — and fossil generation has now declined for six straight years. Ember's team frames the next challenge as managing an orderly retirement of the country's ageing coal plants without compromising grid reliability.",
    note: "43% of Australian households now have rooftop solar, a major driver of the residential generation boom.",
    link: "https://ember-energy.org/countries-and-regions/australia",
    report: null
  },
  392: { // Japan
    name: "Japan",
    headline: "Japan's solar output hit a record share in 2025, but wind stayed nearly flat.",
    clean: 33, windSolar: 10, fossil: 67,
    narrative: "Solar passed 10% of Japan's generation for the first time in 2025, nearly tripling over the decade, while nuclear restarts added a further boost. Wind power has barely moved past 1% of the mix — far behind the rest of the G7 — and Ember flags offshore wind as Japan's biggest untapped opportunity.",
    note: "Japan remains the world's fourth-largest solar generator despite its slow progress on wind.",
    link: "https://ember-energy.org/countries-and-regions/japan",
    report: null
  },
  76: { // Brazil
    name: "Brazil",
    headline: "Brazil has already beaten its 2030 renewables target.",
    clean: 89, windSolar: 27, fossil: 11,
    narrative: "Brazil generates the vast majority of its electricity from clean sources, led by hydro, and has already beaten its 2030 renewables goal ahead of schedule. Wind and solar hit a record 34% of the mix for a full month in August 2025 — Ember's focus now shifts to grids and storage to fully use that potential.",
    note: "Brazil is the world's second-largest hydropower generator and a leader in renewables among G20 economies.",
    link: "https://ember-energy.org/countries-and-regions/brazil",
    report: null
  },
  616: { // Poland
    name: "Poland",
    headline: "Poland has cut coal's share of power from 91% to about half in two decades.",
    clean: 31, windSolar: 25, fossil: 69,
    narrative: "Poland has cut coal's share of its power mix from 91% two decades ago to roughly half today, without giving up strong GDP growth — a path Ember frames as a more relatable model for other coal-reliant economies than some Western European examples. Solar capacity has grown especially fast since 2020.",
    note: "Poland accounted for 65% of the EU's coal-mine methane emissions in 2023; satellites have since detected over 100 super-emitter events at Polish mines.",
    link: "https://ember-energy.org/countries-and-regions/poland",
    report: null
  },
  792: { // Turkey / Türkiye
    name: "Türkiye",
    headline: "Wind and solar overtook the global average in Türkiye, but coal still leads.",
    clean: 43, windSolar: 22, fossil: 57,
    narrative: "Wind and solar reached 22% of Türkiye's power mix in 2025, above the global average, but coal remains the single largest source at 34% of generation — most of it imported. Ember frames that reliance as an energy-security risk as much as a climate one, given the exposure to global fuel-price swings.",
    note: "Renewables are estimated to have cut household electricity bills by roughly a month's worth over the year.",
    link: "https://ember-energy.org/countries-and-regions/turkiye",
    report: { label: "Türkiye Electricity Review 2026", url: "https://ember-energy.org/latest-insights/turkiye-electricity-review-2026" }
  },
  360: { // Indonesia
    name: "Indonesia",
    headline: "Indonesia remains one of the most fossil-reliant major economies Ember tracks.",
    clean: 18, windSolar: 0.5, fossil: 82,
    narrative: "Indonesia remains one of the most fossil-reliant major economies Ember tracks, with wind and solar barely registering in the generation mix even as neighbours like the Philippines and Thailand pull ahead. The government has floated a 100 GW solar ambition, but current power-development plans still lean heavily on coal expansion.",
    note: "Indonesia is now the world's fifth-largest coal power generator, with coal output still rising.",
    link: "https://ember-energy.org/countries-and-regions/indonesia",
    report: null
  }
};
