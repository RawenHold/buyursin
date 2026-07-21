export type ProposalModuleId = "bms" | "metering" | "hvac" | "light" | "water" | "safety";

export type ProposalData = {
  client: string;
  objectName: string;
  objectType: string;
  area: number;
  monthlyEnergy: number;
  monthlyOps: number;
  budget: number;
  savingPercent: number;
  currency: "UZS" | "USD";
  accent: string;
  logoDataUrl?: string;
  modules: ProposalModuleId[];
};
