/**
 * Deterministic date-based PRNG (Mulberry32) and Fisher-Yates shuffle.
 * Produces the exact same sequence for any given calendar date across all devices,
 * browsers, and page reloads, and automatically advances to a new arrangement on the next day.
 */

export function getDailySeed(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  // Unique integer for each day, e.g. 20261117
  return year * 10000 + month * 100 + day;
}

function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles an array based on the day's seed.
 * Does not mutate the input array.
 */
export function dailyShuffle(array, date = new Date()) {
  if (!Array.isArray(array) || array.length <= 1) {
    return array ? [...array] : [];
  }

  const copy = [...array];
  const rng = mulberry32(getDailySeed(date));

  // Fisher-Yates deterministic shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}
