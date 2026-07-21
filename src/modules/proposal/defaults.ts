import type { ProposalData, ProposalModuleId } from "./types";

export const proposalModules: ProposalModuleId[] = ["bms", "metering", "hvac", "light", "water", "safety"];

export const defaultProposal: ProposalData = {
  client: "CLIENT COMPANY",
  objectName: "Business Center",
  objectType: "Коммерческая недвижимость",
  area: 18500,
  monthlyEnergy: 180000000,
  monthlyOps: 95000000,
  budget: 1600000000,
  savingPercent: 17,
  currency: "UZS",
  accent: "#166f67",
  modules: ["bms", "metering", "hvac", "safety"],
};
