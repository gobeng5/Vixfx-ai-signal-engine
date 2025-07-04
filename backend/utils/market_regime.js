export function detectMarketRegime(prices) {
  if (prices.length < 10) return 'unknown';

  const recent = prices.slice(-10);
  const diffs = recent.map((p, i) => i > 0 ? p - recent[i - 1] : 0).slice(1);

  const avgMove = diffs.reduce((a, b) => a + Math.abs(b), 0) / diffs.length;
  const stdDev = Math.sqrt(diffs.reduce((a, b) => a + Math.pow(b - avgMove, 2), 0) / diffs.length);

  if (avgMove > 2 && stdDev > 1.5) return 'trending';
  if (avgMove < 1 && stdDev < 1) return 'ranging';
  return 'consolidating';
}
