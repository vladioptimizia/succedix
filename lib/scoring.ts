import { Business, BuyerReadinessInput, SellerReadinessInput } from "./types";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Seller Readiness Score (0-100).
 * Weighted by: financial health, owner independence, documentation, clarity of intent.
 */
export function calculateSellerReadinessScore(
  input: SellerReadinessInput
): number {
  let score = 0;

  // Financial health (30 pts)
  if (input.annualRevenue > 0) score += 10;
  score += Math.min(10, input.operatingMargin / 2);
  score += input.recurringClients ? 10 : 0;

  // Owner independence (25 pts) — lower dependency is better
  score += ((100 - input.ownerDependency) / 100) * 25;

  // Documentation & compliance (25 pts)
  score += input.hasDocumentedProcesses ? 8 : 0;
  score += input.documentsOrganized ? 8 : 0;
  score += input.accountingUpToDate ? 5 : 0;
  score += input.licensesValid ? 4 : 0;

  // Clarity of intent (20 pts)
  score += input.timeline !== "aberto" ? 10 : 5;
  score += input.description.trim().length > 30 ? 10 : 5;

  return clampScore(score);
}

/**
 * Buyer Readiness Score (0-100).
 * Weighted by: capital confirmed, focus/clarity, experience, availability.
 */
export function calculateBuyerReadinessScore(
  input: BuyerReadinessInput
): number {
  let score = 0;

  // Capital (35 pts)
  score += input.capitalMin >= 50000 ? 20 : 10;
  score += input.capitalSource === "proprio" ? 15 : 10;

  // Focus & clarity (25 pts)
  score += input.sectorsInterested.length > 0 ? 15 : 0;
  score += !input.openToOtherSectors ? 10 : 5;

  // Experience & involvement (25 pts)
  score += input.experienceBackground.trim().length > 0 ? 15 : 0;
  score += input.involvementType !== "unknown" ? 10 : 0;

  // Availability & timeline (15 pts)
  score += input.hoursAvailablePerWeek >= 20 ? 8 : 4;
  score += input.timelineMonths <= 6 ? 7 : 4;

  return clampScore(score);
}

/**
 * Succession Fit Score (0-100): compatibility between a business and a buyer profile.
 */
export function calculateSuccessionFitScore(
  business: Business,
  buyer: BuyerReadinessInput
): number {
  let score = 0;

  // Sector match (30 pts)
  if (buyer.sectorsInterested.includes(business.sector)) {
    score += 30;
  } else if (buyer.openToOtherSectors) {
    score += 12;
  }

  // Location match (25 pts)
  if (business.canton === buyer.regionMain) {
    score += 15;
  } else if (buyer.exploreOtherRegions) {
    score += 6;
  }
  if (business.distanceKm <= buyer.radiusKm) {
    score += 10;
  }

  // Price/capital match (25 pts)
  const withinBudget =
    business.priceMin <= buyer.capitalMax &&
    business.priceMax >= buyer.capitalMin;
  score += withinBudget ? 25 : 0;

  // Seller readiness contributes to overall fit confidence (20 pts)
  score += (business.sellerReadinessScore / 100) * 20;

  return clampScore(score);
}

export function scoreStatus(score: number): {
  label: string;
  color: "green" | "amber" | "orange" | "red";
} {
  if (score >= 80) return { label: "Excelente", color: "green" };
  if (score >= 60) return { label: "Bom", color: "amber" };
  if (score >= 40) return { label: "Aceitável", color: "orange" };
  return { label: "Fraco", color: "red" };
}
