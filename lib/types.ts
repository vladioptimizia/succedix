import type { SectorValue, CantonValue } from "./taxonomy";

// Sector e Canton derivam da fonte única de verdade em lib/taxonomy.ts.
// Para adicionar um novo sector/cantão, editar APENAS lib/taxonomy.ts.
export type Sector = SectorValue;
export type Canton = CantonValue;

export interface SellerReadinessInput {
  businessName: string;
  sector: Sector;
  canton: Canton;
  foundedYear: number;
  annualRevenue: number;
  operatingMargin: number;
  recurringClients: boolean;
  saleReason: "aposentadoria" | "burnout" | "mudanca" | "outro";
  timeline: "1_mes" | "3_6_meses" | "1_ano" | "aberto";
  confidentiality: "muito_sigilo" | "normal" | "posso_contar";
  ownerDependency: 0 | 25 | 50 | 75 | 100;
  hasDocumentedProcesses: boolean;
  teamSize: number;
  documentsOrganized: boolean;
  accountingUpToDate: boolean;
  licensesValid: boolean;
  description: string;
}

export interface BuyerReadinessInput {
  capitalMin: number;
  capitalMax: number;
  capitalSource: "proprio" | "credito" | "combinado" | "investor";
  sectorsInterested: Sector[];
  openToOtherSectors: boolean;
  regionMain: Canton;
  radiusKm: number;
  exploreOtherRegions: boolean;
  involvementType: "operator" | "investor" | "unknown";
  hoursAvailablePerWeek: number;
  experienceBackground: string;
  timelineMonths: number;
  languages: string[];
}

export interface Business {
  id: string;
  name: string;
  sector: Sector;
  canton: Canton;
  city: string;
  distanceKm: number;
  priceMin: number;
  priceMax: number;
  establishedYear: number;
  photoUrl: string;
  sellerReadinessScore: number;
  tags: string[];
}

export type SwipeAction = "like" | "pass" | "save";
