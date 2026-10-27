/** Common everyday words used to build adaptive practice. Original list, lowercase, ASCII. */
export const COMMON_WORDS: readonly string[] = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one',
  'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two',
  'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'yes', 'yet', 'job',
  'box', 'fix', 'mix', 'six', 'fox', 'tax', 'wax', 'zoo', 'zip', 'jam', 'joy', 'key', 'kit', 'quiz',
  'about', 'after', 'again', 'below', 'could', 'every', 'first', 'found', 'great', 'house', 'large',
  'learn', 'never', 'other', 'place', 'plant', 'point', 'right', 'small', 'sound', 'spell', 'still',
  'study', 'their', 'there', 'these', 'thing', 'think', 'three', 'water', 'where', 'which', 'world',
  'would', 'write', 'black', 'brown', 'clean', 'climb', 'clock', 'cover', 'dream', 'early', 'field',
  'quick', 'quiet', 'queen', 'quote', 'equal', 'jump', 'just', 'judge', 'juice', 'major', 'enjoy',
  'zero', 'zone', 'lazy', 'dozen', 'prize', 'size', 'maze', 'extra', 'exact', 'next', 'text', 'taxi',
  'very', 'give', 'have', 'live', 'move', 'over', 'even', 'seven', 'value', 'voice', 'visit', 'level',
  'back', 'book', 'look', 'make', 'keep', 'kind', 'know', 'like', 'take', 'week', 'work', 'walk',
  'park', 'mark', 'dark', 'pick', 'quick', 'check', 'thick', 'brick', 'block', 'black', 'track',
  'good', 'game', 'gift', 'glad', 'goal', 'gold', 'grow', 'green', 'group', 'guess', 'guide', 'giant',
  'help', 'home', 'hand', 'hold', 'hope', 'hour', 'high', 'half', 'happy', 'heart', 'heavy', 'horse',
  'warm', 'wire', 'wish', 'word', 'wind', 'wide', 'wild', 'west', 'whale', 'wheel', 'white', 'whole',
  'play', 'part', 'pass', 'path', 'pick', 'pink', 'plan', 'pull', 'push', 'paper', 'piano', 'proud',
  'blue', 'bird', 'boat', 'body', 'bold', 'bring', 'build', 'busy', 'begin', 'bench', 'brave',
  'call', 'came', 'card', 'care', 'city', 'cold', 'come', 'cook', 'cool', 'copy', 'cream', 'crisp',
  'fast', 'fact', 'fall', 'farm', 'feel', 'fill', 'find', 'fine', 'fire', 'five', 'flag', 'fresh',
  'line', 'list', 'long', 'lost', 'love', 'lunch', 'lucky', 'light', 'lemon', 'river', 'robot',
  'name', 'near', 'need', 'nice', 'nine', 'note', 'noon', 'north', 'night', 'ocean', 'order', 'open',
  'rain', 'read', 'real', 'rest', 'rice', 'ride', 'ring', 'road', 'rock', 'room', 'rule', 'round',
  'safe', 'same', 'sand', 'save', 'seat', 'ship', 'shop', 'show', 'side', 'sign', 'sing', 'slow',
  'tall', 'team', 'tell', 'test', 'time', 'tiny', 'tree', 'true', 'turn', 'type', 'today', 'touch',
  'under', 'until', 'upper', 'usual', 'drive', 'drink', 'dance', 'daily', 'door', 'down', 'draw',
];

/**
 * Words containing the given keys, preferring words that contain more of them.
 * Deterministic for a given input.
 */
export function wordsContaining(keys: readonly string[], max: number): string[] {
  const wanted = keys.map((k) => k.toLowerCase()).filter((k) => /^[a-z]$/.test(k));
  if (wanted.length === 0) return [];
  const seen = new Set<string>();
  const scored: { word: string; score: number }[] = [];
  for (const word of COMMON_WORDS) {
    if (seen.has(word)) continue;
    seen.add(word);
    const score = wanted.reduce((n, k) => n + (word.includes(k) ? 1 : 0), 0);
    if (score > 0) scored.push({ word, score });
  }
  scored.sort((a, b) => b.score - a.score || a.word.length - b.word.length || a.word.localeCompare(b.word));
  // Interleave so every weak key appears, not only the first one.
  const out: string[] = [];
  for (const k of wanted) {
    const hit = scored.find((s) => s.word.includes(k) && !out.includes(s.word));
    if (hit) out.push(hit.word);
  }
  for (const s of scored) {
    if (out.length >= max) break;
    if (!out.includes(s.word)) out.push(s.word);
  }
  return out.slice(0, max);
}
