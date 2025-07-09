const BASE_URL = 'https://vixfx-ai-signal-engine.onrender.com/api'; // replace with actual backend URL

export async function fetchSignals() {
  const res = await fetch(`${BASE_URL}/signals`);
  return await res.json();
}

export async function fetchWinRateStats() {
  const res = await fetch(`${BASE_URL}/stats/winrate`);
  return await res.json();
}

