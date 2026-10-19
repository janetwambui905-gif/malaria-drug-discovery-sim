// Demo candidate data and shared application state.
const candidates = [
  { id: "pyrimethamine", name: "Pyrimethamine", tag: "REFERENCE", wt: -7.1, mutant: -5.2, tolerance: 54, violations: 0, mw: 248.7, smiles: "CC1=NC(=NC(=C1)N)C2=CC=C(C=C2)Cl", color: "#94a3b8", admet: [74, 70, 78, 65], atomCount: 13 },
  { id: "p218", name: "P218", tag: "CLINICAL LEAD", wt: -9.2, mutant: -8.1, tolerance: 88, violations: 1, mw: 439.4, smiles: "CC1=NC(NC(=N1)NCC2=CC=CC=C2)NC3=CC=C(C=C3)C(=O)N", color: "#60a5fa", admet: [68, 82, 72, 70], atomCount: 18 },
  { id: "cadd04", name: "Candidate CADD-04", tag: "TOP HIT", wt: -9.6, mutant: -8.8, tolerance: 94, violations: 0, mw: 382.4, smiles: "COC1=CC=C(C=C1)C2=NC(N)=NC(=N2)NCC3=CC=CC=C3", color: "#5eead4", admet: [82, 88, 84, 76], atomCount: 17 },
  { id: "cadd09", name: "Candidate CADD-09", tag: "RESISTANT", wt: -8.8, mutant: -8.3, tolerance: 91, violations: 1, mw: 416.5, smiles: "CCOC1=CC=C(C=C1)C2=NC(N)=NC(=N2)NCC3=CC=C(F)C=C3", color: "#c084fc", admet: [71, 79, 76, 83], atomCount: 19 },
  { id: "cadd12", name: "Candidate CADD-12", tag: "OPTIMIZATION", wt: -9.0, mutant: -7.7, tolerance: 82, violations: 0, mw: 354.3, smiles: "NC1=NC(NCC2=CC=C(O)C=C2)=NC(=N1)C3=CC=CC=C3", color: "#fbbf24", admet: [88, 74, 87, 68], atomCount: 16 }
];
const pipelineMessages = [
  ["Fetching target structures", "Loaded PfDHFR wild type and resistance variant models (PDB reference: 1J3I)."],
  ["Preparing compound libraries", "Normalized 1,248 demo entries from ChEMBL / ZINC sample libraries."],
  ["Running docking simulation", "Scored ligand poses against wild type DHFR using the simulated Vina / GNINA workflow."],
  ["Cross-filtering resistance variants", "Compared binding retention across S108N, C59R, and I164L mutation panel."],
  ["Ranking with ML ensemble", "Generated consensus ranking from an illustrative XGBoost / scikit-learn score."],
  ["Checking drug-like properties", "Applied simulated RDKit Lipinski and SwissADME-inspired property filters."],
  ["Exporting prioritized shortlist", "Shortlist ready: 12 ranked hits, including resistance-tolerant lead candidates."]
];
let selectedId = "pyrimethamine";
let activeRun = false;
let bindingChart;
let admetChart;
const hotspotState = { "S108N": true, "C59R": true, "I164L": true };
