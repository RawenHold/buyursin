export type ProposalModuleId = "bms" | "metering" | "hvac" | "light" | "water" | "safety";

export type ProposalData = {
  client: string;
  objectName: string;
  objectType: string;
  offerDescription: string;
  priceNote: string;
  ctaText: string;
  area: number;
  monthlyEnergy: number;
  monthlyOps: number;
  budget: number;
  savingPercent: number;
  currency: "UZS" | "USD";
  accent: string;
  logoDataUrl?: string;
  objectPhotoDataUrl?: string;
  modules: ProposalModuleId[];
};
