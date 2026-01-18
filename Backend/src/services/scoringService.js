// Basic deterministic scoring used by backend (0-100)
function normalizePriceScore(total, minTotal) {
  if (!total || !minTotal) return 0;
  return Math.max(0, Math.min(100, (minTotal / total) * 100));
}

function computeScoresForProposals(proposals) {
  // proposals: [{ id, parsed: { total: { amount } , delivery_days, warranty_months, confidence } }]
  const totals = proposals.map(p => (p.parsed?.total?.amount || Number.POSITIVE_INFINITY));
  const minTotal = Math.min(...totals);
  return proposals.map(p => {
    const priceScore = normalizePriceScore(p.parsed?.total?.amount || Infinity, minTotal || 1) * 0.4;
    const deliveryScore = (p.parsed?.delivery_days ? Math.max(0, 30 - p.parsed.delivery_days) / 30 * 100 : 50) * 0.2;
    const warrantyScore = (p.parsed?.warranty_months ? Math.min(p.parsed.warranty_months, 24) / 24 * 100 : 50) * 0.15;
    const completeness = (p.parsed?.line_items && p.parsed.line_items.length > 0) ? 100 : 0;
    const completenessScore = completeness * 0.15;
    const confidence = p.parsed?.confidence?.overall || 0.7;
    const confidenceScore = confidence * 100 * 0.1;
    const final = priceScore + deliveryScore + warrantyScore + completenessScore + confidenceScore;
    return { ...p, score: Math.round(final) };
  });
}

module.exports = { computeScoresForProposals };
