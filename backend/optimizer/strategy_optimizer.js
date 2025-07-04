import Signal from '../models/Signal.js';

export async function optimizeStrategies() {
  const signals = await Signal.find({ result: { $in: ['win', 'loss'] } });

  const regimes = { trending: [], ranging: [], consolidating: [] };

  signals.forEach(sig => {
    const regime = (sig.note || '').includes('trending') ? 'trending'
                 : (sig.note || '').includes('ranging') ? 'ranging'
                 : 'consolidating';

    regimes[regime].push(sig);
  });

  const summary = {};

  for (const [regime, group] of Object.entries(regimes)) {
    const total = group.length;
    const wins = group.filter(s => s.result === 'win').length;
    const winRate = total ? ((wins / total) * 100).toFixed(2) : '0.00';

    summary[regime] = {
      total,
      wins,
      winRate: `${winRate}%`
    };
  }

  return summary;
}
