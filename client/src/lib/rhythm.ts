/**
 * Daily rhythm: a forgiving streak designed to build a practice habit without
 * punishing real life.
 *
 *  - A day counts when practice minutes reach the daily goal (1 minute when the
 *    goal is off).
 *  - Today never breaks the rhythm: an unfinished today just hasn't counted yet.
 *  - One missed day in any rolling 7-day window is an automatic rest day, so the
 *    rhythm survives it. A second miss inside that window ends the rhythm.
 */

export type PracticeLog = Record<string, number>; // 'YYYY-MM-DD' (local) -> minutes
export type DailyGoal = 0 | 5 | 10 | 15;

export interface Rhythm {
  /** Days in the current rhythm (rest days don't add to the count). */
  currentDays: number;
  /** Longest rhythm ever recorded in the log. */
  bestDays: number;
  todayMinutes: number;
  goalMet: boolean;
  /** A rest day was used inside the last 7 days of the current rhythm. */
  restDayUsedThisWeek: boolean;
}

const REST_WINDOW = 7;

export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}

function shiftKey(key: string, days: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return localDateKey(d);
}

/** The n day keys ending today, oldest first. */
export function lastNDays(today: string, n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(shiftKey(today, -i));
  return out;
}

export function goalThreshold(goal: DailyGoal): number {
  return goal === 0 ? 1 : goal;
}

/** Add minutes to a day, keeping only the most recent `cap` days. */
export function addPractice(log: PracticeLog, dateKey: string, minutes: number, cap = 400): PracticeLog {
  const next: PracticeLog = { ...log, [dateKey]: Math.round(((log[dateKey] ?? 0) + Math.max(0, minutes)) * 100) / 100 };
  const keys = Object.keys(next).sort();
  if (keys.length > cap) {
    for (const k of keys.slice(0, keys.length - cap)) delete next[k];
  }
  return next;
}

/**
 * Walk backwards from `fromKey` (inclusive) counting met days, allowing one
 * miss per rolling 7-day window. Returns the met-day count and the days (as
 * offsets back from fromKey) where rest days were spent.
 */
function walkBack(
  log: PracticeLog,
  threshold: number,
  fromKey: string,
  stopBeforeKey: string | null,
): { days: number; restOffsets: number[] } {
  let days = 0;
  const restOffsets: number[] = [];
  let pendingRest: number | null = null;
  for (let offset = 0; ; offset++) {
    const key = shiftKey(fromKey, -offset);
    if (stopBeforeKey !== null && key < stopBeforeKey) break;
    const met = (log[key] ?? 0) >= threshold;
    if (met) {
      if (pendingRest !== null) {
        restOffsets.push(pendingRest);
        pendingRest = null;
      }
      days++;
      continue;
    }
    // A miss: allowed only if no rest day was used within the last 7 walked days.
    const lastRest = restOffsets.length ? restOffsets[restOffsets.length - 1] : null;
    const restAvailable = pendingRest === null && (lastRest === null || offset - lastRest >= REST_WINDOW);
    if (restAvailable && days > 0) {
      pendingRest = offset;
      continue;
    }
    break;
  }
  return { days, restOffsets };
}

export function computeRhythm(log: PracticeLog, goal: DailyGoal, today: string = localDateKey()): Rhythm {
  const threshold = goalThreshold(goal);
  const todayMinutes = log[today] ?? 0;
  const goalMet = todayMinutes >= threshold;

  // Today counts if met; if not, the rhythm is measured from yesterday.
  const start = goalMet ? today : shiftKey(today, -1);
  const { days: currentDays, restOffsets } = walkBack(log, threshold, start, null);
  const restDayUsedThisWeek = currentDays > 0 && restOffsets.some((o) => o < REST_WINDOW);

  // Best: try every met day in the log as an end point.
  const keys = Object.keys(log).sort();
  const earliest = keys[0] ?? today;
  let bestDays = currentDays;
  for (const key of keys) {
    if ((log[key] ?? 0) < threshold) continue;
    const { days } = walkBack(log, threshold, key, earliest);
    if (days > bestDays) bestDays = days;
  }

  return { currentDays, bestDays, todayMinutes, goalMet, restDayUsedThisWeek };
}
