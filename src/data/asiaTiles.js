// Schematic tile grid standing in for a geographic map of Asia.
// Deliberately not built from real borders or projected coordinates — this is
// a tilegram: each country gets an equal-size square, placed on a grid so its
// position roughly preserves where it sits relative to its neighbours (China
// north-central, India south-west of it, the archipelago nations to the
// south-east, Japan/Korea to the north-east, and so on). That sidesteps any
// question of exact boundary lines, which a real projected map of this region
// can't avoid (contested borders, disputed territory shapes).
//
// Grid positions were generated once from the original projected centroids
// via a greedy nearest-free-cell placement, then left fixed.

export const COLS = 12;
export const ROWS = 10;

export const TILES = {
  KZ: { name: "Kazakhstan", col: 1, row: 0 },
  MN: { name: "Mongolia", col: 6, row: 0 },
  UZ: { name: "Uzbekistan", col: 1, row: 1 },
  KG: { name: "Kyrgyzstan", col: 2, row: 1 },
  TM: { name: "Turkmenistan", col: 0, row: 2 },
  TJ: { name: "Tajikistan", col: 2, row: 2 },
  CN: { name: "China", col: 6, row: 2 },
  KP: { name: "North Korea", col: 9, row: 2 },
  KR: { name: "South Korea", col: 10, row: 2 },
  JP: { name: "Japan", col: 11, row: 2 },
  AF: { name: "Afghanistan", col: 0, row: 3 },
  PK: { name: "Pakistan", col: 1, row: 3 },
  BD: { name: "Bangladesh", col: 4, row: 3 },
  NP: { name: "Nepal", col: 2, row: 4 },
  IN: { name: "India", col: 3, row: 4 },
  BT: { name: "Bhutan", col: 4, row: 4 },
  TW: { name: "Taiwan", col: 9, row: 4 },
  MM: { name: "Myanmar", col: 5, row: 5 },
  LA: { name: "Laos", col: 6, row: 5 },
  VN: { name: "Vietnam", col: 7, row: 5 },
  PH: { name: "Philippines", col: 9, row: 5 },
  KH: { name: "Cambodia", col: 5, row: 6 },
  TH: { name: "Thailand", col: 6, row: 6 },
  LK: { name: "Sri Lanka", col: 3, row: 7 },
  MY: { name: "Malaysia", col: 6, row: 7 },
  BN: { name: "Brunei", col: 8, row: 7 },
  SG: { name: "Singapore", col: 6, row: 8 },
  ID: { name: "Indonesia", col: 8, row: 8 },
  TL: { name: "Timor-Leste", col: 9, row: 9 },
};
