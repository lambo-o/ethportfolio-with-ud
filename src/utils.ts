import type { Diffs, Holding } from "./types";

export function toUSD(x: any) {
  if(typeof x !== 'number' || isNaN(x)) {
    return ' NaN'
  }

  return ` $${x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} USD`;
}

export function calcOverallDiffs(holdings: Holding[]) {
  const diffs: Diffs = {
    diff: 0,
    diff7d: 0,
    diff30d: 0,
  };
  let total = 0;

  holdings.forEach((holding) => {
    diffs.diff += (holding.diff ? holding.diff * holding.value : 0) ;
    diffs.diff7d += (holding.diff7d ? holding.diff7d * holding.value : 0) ;
    diffs.diff30d += (holding.diff30d ? holding.diff30d * holding.value : 0) ;
    total += (holding.value ? holding.value : 0);
  });

  for (let key in diffs) {
    diffs[key] = diffs[key] / total;
  }

  return diffs;
}
