import { CATALOG } from "./catalog";
import type { CatalogItem, CatalogItemRule, RecommendationContext, RecommendedItem } from "./types";

function norm(s: string) {
  return s.trim().toLowerCase();
}

function matchesAny(haystack: string[] | undefined, needles: string[] | undefined) {
  if (!needles || needles.length === 0) return false;
  if (!haystack || haystack.length === 0) return false;
  const hs = new Set(haystack.map(norm));
  return needles.some((n) => hs.has(norm(n)));
}

function matchesBagType(bagType: string, bagTypes: string[] | undefined) {
  if (!bagTypes || bagTypes.length === 0) return false;
  return bagTypes.map(norm).includes(norm(bagType));
}

function ruleScore(
  rule: CatalogItemRule,
  ctx: RecommendationContext
): { score: number; reason?: string; reasons?: string[] } {
  const w = rule.weight ?? 1;

  let s = 0;
  const reasons: string[] = [];

  if (rule.tripTypes && matchesAny(ctx.tripTypesSelected, rule.tripTypes)) {
    s += 2 * w;
    if (rule.reason) reasons.push(rule.reason);
    else reasons.push("Matches your trip type");
  }

  if (rule.transportModes && matchesAny(ctx.transportModes, rule.transportModes)) {
    s += 2 * w;
    if (rule.reason) reasons.push(rule.reason);
    else reasons.push("Matches your transport");
  }

  if (rule.bagTypes && matchesBagType(ctx.bagType, rule.bagTypes)) {
    s += 2 * w;
    if (rule.reason) reasons.push(rule.reason);
    else reasons.push("Fits this bag type");
  }

  // Jos rule ei osunut mihinkään, score 0
  return { score: s, reasons };
}

function pickPrimaryReason(reasons: string[]) {
  // pidetään UI:lle yksi napakka syy
  return reasons[0];
}

function computeItem(ctx: RecommendationContext, item: CatalogItem): RecommendedItem | null {
  const base = item.basePriority ?? 0;
  let score = base;
  const reasons: string[] = [];

  if (item.universal) {
    // universal antaa pienen “always” painon
    score += 1;
    reasons.push("Common essential");
  }

  if (item.rules && item.rules.length > 0) {
    for (const r of item.rules) {
      const res = ruleScore(r, ctx);
      if (res.score > 0) {
        score += res.score;
        if (res.reasons?.length) reasons.push(...res.reasons);
      }
    }
  }

  // Jos item ei ole universal eikä saanut yhtään rule-hit, sitä ei ehdoteta
  const hadRuleHit =
    (item.rules?.some((r) => ruleScore(r, ctx).score > 0) ?? false) || false;

  if (!item.universal && !hadRuleHit) return null;

  // Filter: poista jos bagissa jo
  const existing = new Set((ctx.existingItemNames ?? []).map(norm));
  if (existing.has(norm(item.name))) return null;

  // Dedup syyt
  const uniqReasons = Array.from(new Set(reasons));

  return {
    name: item.name,
    score,
    reasons: uniqReasons,
    reason: uniqReasons.length ? pickPrimaryReason(uniqReasons) : undefined,
  };
}

export function getBagSuggestions(ctx: RecommendationContext, opts?: { limit?: number }): RecommendedItem[] {
  const limit = opts?.limit ?? 12;

  const scored: RecommendedItem[] = [];
  for (const it of CATALOG) {
    const rec = computeItem(ctx, it);
    if (rec) scored.push(rec);
  }

  scored.sort((a, b) => b.score - a.score);

  // dedup by name (varmuuden vuoksi)
  const seen = new Set<string>();
  const out: RecommendedItem[] = [];
  for (const r of scored) {
    const key = norm(r.name);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
    if (out.length >= limit) break;
  }

  return out;
}