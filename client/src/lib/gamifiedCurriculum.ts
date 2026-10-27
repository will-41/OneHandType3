// One-Type skill path curriculum: ten units from the home row to mastery.
//
// Lesson ids (lesson-<unit>-<n>) are persisted in users' progress and must never change.
// Unit ids keep the number in the second segment (unit-<n>-<slug>) so unitNumber() works.

export type UnitIcon =
  | 'home'
  | 'words'
  | 'sentences'
  | 'numbers'
  | 'speed'
  | 'precision'
  | 'endurance'
  | 'code'
  | 'trophy'
  | 'graduation';

export interface CurriculumLesson {
  id: string;
  title: string;
  description: string;
  theme: {
    /** Short label for the keys in focus, e.g. "Keys: a s d f". */
    focusLabel: string;
    /** One practical tip shown before the lesson. */
    tip: string;
  };
  targetWpm: number;
  targetAccuracy: number;
  /** One-line summary (fallback when practiceText is empty). */
  content: string;
  /** Lines to type. ASCII only. */
  practiceText: string[];
  /** Single key characters this lesson trains. */
  keyFocus: string[];
  /** Minutes, derived from text length and target speed. */
  estimatedTime: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  rewards: { xp: number };
}

export interface CurriculumUnit {
  id: `unit-${number}-${string}`;
  title: string;
  description: string;
  theme: {
    tagline: string;
    skillFocus: string;
    icon: UnitIcon;
  };
  lessons: CurriculumLesson[];
}

/** @deprecated Use CurriculumUnit. Kept so older imports still compile. */
export type CurriculumLevel = CurriculumUnit;

export const gamifiedCurriculum: CurriculumUnit[] = [
  {
    id: "unit-1-home-row",
    title: "Home Row",
    description: "Learn where your fingers rest and reach.",
    theme: { tagline: "Where every finger starts.", skillFocus: "Home-row anchors and first reaches", icon: "home" },
    lessons: [
      {
        id: "lesson-1-1",
        title: "Home row anchors",
        description: "Find the home row and return to it after every key.",
        theme: { focusLabel: "Keys: a s d f j k l ;", tip: "Rest on the home row and return to it after every key." },
        targetWpm: 5,
        targetAccuracy: 90,
        content: "Basic finger positioning on F and J keys",
        practiceText: [
          "asdf jkl;",
          "fjfj fjfj fjfj",
          "asdf jkl; asdf jkl;",
          "ff jj ff jj dd kk dd kk"
        ],
        keyFocus: ["a", "s", "d", "f", "j", "k", "l", ";"],
        estimatedTime: 5,
        difficulty: 1,
        rewards: { xp: 10 },
      },
      {
        id: "lesson-1-2",
        title: "Reach up: top row",
        description: "Reach to the top row and come straight back.",
        theme: { focusLabel: "Keys: e r t u i o w", tip: "Reach up and come straight back down." },
        targetWpm: 8,
        targetAccuracy: 85,
        content: "Reach to the top row and come straight back.",
        practiceText: [
          "fed red jet",
          "tree rule fire wire",
          "sit out jot toe",
          "we are true to it"
        ],
        keyFocus: ["e", "r", "t", "u", "i", "o", "w"],
        estimatedTime: 3,
        difficulty: 2,
        rewards: { xp: 20 },
      },
      {
        id: "lesson-1-3",
        title: "Reach down: bottom row",
        description: "Short reaches to the bottom row.",
        theme: { focusLabel: "Keys: b n m v c x z", tip: "The bottom row is a short reach; keep the wrist still." },
        targetWpm: 12,
        targetAccuracy: 88,
        content: "Short reaches to the bottom row.",
        practiceText: [
          "cab can man van",
          "mix zinc box",
          "even seven oven",
          "move back and zoom in"
        ],
        keyFocus: ["b", "n", "m", "v", "c", "x", "z"],
        estimatedTime: 2,
        difficulty: 3,
        rewards: { xp: 30 },
      },
    ],
  },
  {
    id: "unit-2-common-words",
    title: "Common Words",
    description: "Type the words you use most, fast.",
    theme: { tagline: "The words you type most.", skillFocus: "High-frequency words and spacing rhythm", icon: "words" },
    lessons: [
      {
        id: "lesson-2-1",
        title: "Top words",
        description: "The most common short words in English.",
        theme: { focusLabel: "Keys: t h e a n o", tip: "These few words are a big share of everything you will ever type." },
        targetWpm: 15,
        targetAccuracy: 90,
        content: "The most common short words in English.",
        practiceText: [
          "the and for are but not",
          "you with all any may can",
          "had her was one our out",
          "day get use man new now"
        ],
        keyFocus: ["t", "h", "e", "a", "n", "o"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 50 },
      },
      {
        id: "lesson-2-2",
        title: "Letter pairs",
        description: "Turn common letter pairs into single motions.",
        theme: { focusLabel: "Keys: t h e r i n", tip: "Pairs become one motion with practice." },
        targetWpm: 18,
        targetAccuracy: 88,
        content: "Turn common letter pairs into single motions.",
        practiceText: [
          "th th he he in in er er",
          "the then there their",
          "an and hand stand",
          "in into thin thing"
        ],
        keyFocus: ["t", "h", "e", "r", "i", "n"],
        estimatedTime: 2,
        difficulty: 3,
        rewards: { xp: 30 },
      },
      {
        id: "lesson-2-3",
        title: "Short phrases",
        description: "Keep a steady rhythm across words and spaces.",
        theme: { focusLabel: "Keys: a e i o u", tip: "Tap space with the same rhythm as a letter." },
        targetWpm: 20,
        targetAccuracy: 92,
        content: "Keep a steady rhythm across words and spaces.",
        practiceText: [
          "on the way home",
          "a good time to start",
          "one more try today",
          "keep it up and go on"
        ],
        keyFocus: ["a", "e", "i", "o", "u"],
        estimatedTime: 2,
        difficulty: 3,
        rewards: { xp: 40 },
      },
    ],
  },
  {
    id: "unit-3-sentences",
    title: "Sentences",
    description: "Capitals, commas, quotes and questions.",
    theme: { tagline: "Capitals, commas, and full stops.", skillFocus: "Punctuation and capital letters", icon: "sentences" },
    lessons: [
      {
        id: "lesson-3-1",
        title: "Capitals and periods",
        description: "Start with a capital, end with a period.",
        theme: { focusLabel: "Keys: .", tip: "On the on-screen keyboard, tapping a letter gives the capital when one is expected." },
        targetWpm: 20,
        targetAccuracy: 92,
        content: "Start with a capital, end with a period.",
        practiceText: [
          "The light turns green.",
          "Rain falls on the roof.",
          "We walk to the park.",
          "A cup of tea cools slowly."
        ],
        keyFocus: ["."],
        estimatedTime: 2,
        difficulty: 3,
        rewards: { xp: 40 },
      },
      {
        id: "lesson-3-2",
        title: "Commas and quotes",
        description: "Commas, lists and quoted speech.",
        theme: { focusLabel: "Keys: , \"", tip: "Quotes come in pairs; count them as you go." },
        targetWpm: 22,
        targetAccuracy: 90,
        content: "Commas, lists and quoted speech.",
        practiceText: [
          "\"Ready when you are,\" she said.",
          "First we plan, then we type.",
          "Bread, butter, and jam.",
          "\"One more line,\" he said, \"and we are done.\""
        ],
        keyFocus: [",", "\""],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 50 },
      },
      {
        id: "lesson-3-3",
        title: "Questions and apostrophes",
        description: "Question marks and contractions.",
        theme: { focusLabel: "Keys: ? '", tip: "The apostrophe sits next to Enter on most layouts." },
        targetWpm: 25,
        targetAccuracy: 94,
        content: "Question marks and contractions.",
        practiceText: [
          "Where did you put it?",
          "It's late, isn't it?",
          "Who's next in line?",
          "Don't rush; you've got this."
        ],
        keyFocus: ["?", "'"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 55 },
      },
    ],
  },
  {
    id: "unit-4-numbers-symbols",
    title: "Numbers & Symbols",
    description: "Dates, prices, brackets and symbols.",
    theme: { tagline: "Dates, prices, and brackets.", skillFocus: "Number row and common symbols", icon: "numbers" },
    lessons: [
      {
        id: "lesson-4-1",
        title: "Number row",
        description: "Numbers, times and prices.",
        theme: { focusLabel: "Keys: 1 2 3 4 5 6 7 8 9 0", tip: "Glance up once, then trust the reach." },
        targetWpm: 18,
        targetAccuracy: 88,
        content: "Numbers, times and prices.",
        practiceText: [
          "10 20 30 40 50",
          "Call back at 9:45 on 03/12",
          "Order 2 boxes of 24 for $18.50",
          "Room 317 opens at 7:30"
        ],
        keyFocus: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        estimatedTime: 2,
        difficulty: 3,
        rewards: { xp: 45 },
      },
      {
        id: "lesson-4-2",
        title: "Brackets and operators",
        description: "Pairs of brackets and simple math.",
        theme: { focusLabel: "Keys: ( ) [ ] { } + - = * /", tip: "Open and close brackets as a pair." },
        targetWpm: 20,
        targetAccuracy: 85,
        content: "Pairs of brackets and simple math.",
        practiceText: [
          "(a + b) * (c - d)",
          "total = price * 2 + tax",
          "list[0] = {size: 10}",
          "x / y = 3.5"
        ],
        keyFocus: ["(", ")", "[", "]", "{", "}", "+", "-", "=", "*", "/"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 55 },
      },
      {
        id: "lesson-4-3",
        title: "Mixed symbols",
        description: "Email addresses, codes and tags.",
        theme: { focusLabel: "Keys: @ # % & _ -", tip: "Symbols share keys with numbers; the Mirror key helps on half layouts." },
        targetWpm: 23,
        targetAccuracy: 90,
        content: "Email addresses, codes and tags.",
        practiceText: [
          "Email: name@example.com",
          "Save 15% with code SPRING_24",
          "Ticket #482 & #483 are done",
          "Use the dash - not the underscore_"
        ],
        keyFocus: ["@", "#", "%", "&", "_", "-"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 65 },
      },
    ],
  },
  {
    id: "unit-5-speed",
    title: "Speed",
    description: "Build pace without losing accuracy.",
    theme: { tagline: "Same accuracy, less hesitation.", skillFocus: "Short bursts and steady pace", icon: "speed" },
    lessons: [
      {
        id: "lesson-5-1",
        title: "Burst drills",
        description: "Short lines typed without pausing.",
        theme: { focusLabel: "Keys: s t a r", tip: "Short lines, no pauses between words." },
        targetWpm: 25,
        targetAccuracy: 87,
        content: "Short lines typed without pausing.",
        practiceText: [
          "go go go",
          "fast and true",
          "ready set type",
          "quick hands calm mind"
        ],
        keyFocus: ["s", "t", "a", "r"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 50 },
      },
      {
        id: "lesson-5-2",
        title: "Accuracy under pace",
        description: "Keep mistakes low as speed rises.",
        theme: { focusLabel: "Keys: h e r", tip: "Read one word ahead of your fingers." },
        targetWpm: 30,
        targetAccuracy: 95,
        content: "Keep mistakes low as speed rises.",
        practiceText: [
          "Keep the rhythm even and the mistakes few.",
          "Speed grows when the fingers stop guessing.",
          "Every clean line is faster than a fixed one.",
          "Breathe, look ahead, and let the next key come."
        ],
        keyFocus: ["h", "e", "r"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 65 },
      },
      {
        id: "lesson-5-3",
        title: "Flow sentences",
        description: "Longer sentences at a steady pace.",
        theme: { focusLabel: "Keys: a n d", tip: "Let common words run together without stopping." },
        targetWpm: 32,
        targetAccuracy: 89,
        content: "Longer sentences at a steady pace.",
        practiceText: [
          "The morning train was late, so we walked the long way around the lake.",
          "She packed a small bag and left before the sun came up.",
          "They painted the fence white and planted roses along the path.",
          "A short walk after lunch clears the mind for the afternoon."
        ],
        keyFocus: ["a", "n", "d"],
        estimatedTime: 3,
        difficulty: 4,
        rewards: { xp: 100 },
      },
    ],
  },
  {
    id: "unit-6-precision",
    title: "Precision",
    description: "Clean up the combinations that trip people.",
    theme: { tagline: "Tricky combinations, clean lines.", skillFocus: "Double letters and awkward reaches", icon: "precision" },
    lessons: [
      {
        id: "lesson-6-1",
        title: "Double letters",
        description: "Repeated letters, one finger, same spot.",
        theme: { focusLabel: "Keys: l o e s", tip: "Two taps, one finger, same spot." },
        targetWpm: 35,
        targetAccuracy: 93,
        content: "Repeated letters, one finger, same spot.",
        practiceText: [
          "letter little ladder",
          "book look took good",
          "coffee toffee",
          "pass less miss moss"
        ],
        keyFocus: ["l", "o", "e", "s"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 60 },
      },
      {
        id: "lesson-6-2",
        title: "Steady hands",
        description: "Vowel clusters that are easy to swap.",
        theme: { focusLabel: "Keys: i e o u", tip: "Accuracy first; speed is the reward." },
        targetWpm: 28,
        targetAccuracy: 96,
        content: "Vowel clusters that are easy to swap.",
        practiceText: [
          "quiet piece field",
          "Their friend tried the view.",
          "Eight weight height",
          "Slow is smooth and smooth is fast."
        ],
        keyFocus: ["i", "e", "o", "u"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 45 },
      },
      {
        id: "lesson-6-3",
        title: "Long and winding",
        description: "Long sentences with commas and semicolons.",
        theme: { focusLabel: "Keys: , ;", tip: "Semicolons live on the home row." },
        targetWpm: 38,
        targetAccuracy: 91,
        content: "Long sentences with commas and semicolons.",
        practiceText: [
          "If the first try fails, change one thing; then try again.",
          "Practice, rest, and return; the hands remember more than you think.",
          "A careful typist corrects less, because there is less to correct.",
          "Patience is not slowness; it is speed that lasts."
        ],
        keyFocus: [",", ";"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 65 },
      },
    ],
  },
  {
    id: "unit-7-endurance",
    title: "Endurance",
    description: "Hold your focus across whole paragraphs.",
    theme: { tagline: "Longer passages, same focus.", skillFocus: "Sustained accuracy over paragraphs", icon: "endurance" },
    lessons: [
      {
        id: "lesson-7-1",
        title: "First paragraph",
        description: "Your first full paragraphs.",
        theme: { focusLabel: "Keys: t h e", tip: "Settle into a pace you could hold for five minutes." },
        targetWpm: 32,
        targetAccuracy: 91,
        content: "Your first full paragraphs.",
        practiceText: [
          "Typing with one hand is a skill, and like any skill it grows with steady practice. The first week feels slow. The second week feels possible. By the third week the fingers know where to go before the eyes do.",
          "Rest matters as much as practice. Short sessions, done often, teach the hands more than one long push. Stop while it still feels good, and come back tomorrow.",
          "Mistakes are information. A missed key tells you which reach needs more time. Slow down on that key for a day, and it will stop asking for attention."
        ],
        keyFocus: ["t", "h", "e"],
        estimatedTime: 5,
        difficulty: 4,
        rewards: { xp: 70 },
      },
      {
        id: "lesson-7-2",
        title: "Mixed punctuation passage",
        description: "Paragraphs with colons, quotes and semicolons.",
        theme: { focusLabel: "Keys: , . : \"", tip: "Punctuation is a rest stop, not a hurdle." },
        targetWpm: 30,
        targetAccuracy: 94,
        content: "Paragraphs with colons, quotes and semicolons.",
        practiceText: [
          "First, warm up: a minute of home row, then a minute of words. Second, pick one lesson and give it your full attention. Third, check the results; not just the speed, but the keys you missed.",
          "\"Why practice every day?\" people ask. Because a little every day beats a lot once a week, and because a habit is easier to keep than to restart.",
          "When a line goes wrong, don't chase it. Finish the line, breathe, and start the next one clean."
        ],
        keyFocus: [",", ".", ":", "\""],
        estimatedTime: 5,
        difficulty: 5,
        rewards: { xp: 55 },
      },
      {
        id: "lesson-7-3",
        title: "Numbers in context",
        description: "Times, counts and distances inside sentences.",
        theme: { focusLabel: "Keys: 1 2 3 4 5 6 7 8 9 0", tip: "Numbers inside sentences are where most typists slow down." },
        targetWpm: 35,
        targetAccuracy: 92,
        content: "Times, counts and distances inside sentences.",
        practiceText: [
          "The library opens at 9:00 and closes at 5:30, except on Thursdays, when it stays open until 8:00.",
          "Of the 120 people surveyed, 45 said they type every day, 60 said a few times a week, and 15 said rarely.",
          "The trail is 4.5 miles long, climbs 850 feet, and takes most walkers about 2 hours."
        ],
        keyFocus: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        estimatedTime: 3,
        difficulty: 5,
        rewards: { xp: 60 },
      },
    ],
  },
  {
    id: "unit-8-technical",
    title: "Technical",
    description: "Code, commands and file paths.",
    theme: { tagline: "Code, commands, and paths.", skillFocus: "Symbol-dense technical text", icon: "code" },
    lessons: [
      {
        id: "lesson-8-1",
        title: "Code basics",
        description: "Short lines of everyday code.",
        theme: { focusLabel: "Keys: ( ) { } ;", tip: "Braces and semicolons end almost every line." },
        targetWpm: 28,
        targetAccuracy: 89,
        content: "Short lines of everyday code.",
        practiceText: [
          "function add(a, b) { return a + b; }",
          "const total = items.length * 2;",
          "if (count > 10) { reset(); }",
          "let name = \"typist\";"
        ],
        keyFocus: ["(", ")", "{", "}", ";"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 75 },
      },
      {
        id: "lesson-8-2",
        title: "Symbol-dense code",
        description: "Comparisons and logic operators.",
        theme: { focusLabel: "Keys: < > | & ! =", tip: "Doubled symbols are one motion repeated." },
        targetWpm: 26,
        targetAccuracy: 87,
        content: "Comparisons and logic operators.",
        practiceText: [
          "if (x >= 10 && y <= 5) { done = true; }",
          "const ok = !error || retries < 3;",
          "values.filter((v) => v !== null)",
          "a[i] = b[j] ^ (c >> 2);"
        ],
        keyFocus: ["<", ">", "|", "&", "!", "="],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 85 },
      },
      {
        id: "lesson-8-3",
        title: "Commands and paths",
        description: "Terminal commands and file paths.",
        theme: { focusLabel: "Keys: / - . ~", tip: "Slashes and dots separate every path." },
        targetWpm: 33,
        targetAccuracy: 91,
        content: "Terminal commands and file paths.",
        practiceText: [
          "cd ~/projects/notes",
          "ls -la ./src/components",
          "git commit -m \"fix typo\"",
          "cp ./draft.txt ../backup/draft-v2.txt"
        ],
        keyFocus: ["/", "-", ".", "~"],
        estimatedTime: 2,
        difficulty: 4,
        rewards: { xp: 70 },
      },
    ],
  },
  {
    id: "unit-9-mastery",
    title: "Mastery",
    description: "Long, fast and accurate.",
    theme: { tagline: "Everything, at full accuracy.", skillFocus: "Long passages at high accuracy and speed", icon: "trophy" },
    lessons: [
      {
        id: "lesson-9-1",
        title: "The long passage",
        description: "One long passage, no corrections.",
        theme: { focusLabel: "Keys: a e t", tip: "One line, one breath, no corrections." },
        targetWpm: 40,
        targetAccuracy: 98,
        content: "One long passage, no corrections.",
        practiceText: [
          "A skill is built in layers. The first layer is knowing where the keys are. The second is reaching them without looking. The third is reaching them without thinking. Most people stop at the second layer and call it done, but the third layer is where typing becomes effortless, and it only arrives with patient, regular practice."
        ],
        keyFocus: ["a", "e", "t"],
        estimatedTime: 3,
        difficulty: 5,
        rewards: { xp: 100 },
      },
      {
        id: "lesson-9-2",
        title: "Speed sprint",
        description: "Every letter of the alphabet, fast and clean.",
        theme: { focusLabel: "Keys: q z x j", tip: "Every letter of the alphabet, as fast as you can keep it clean." },
        targetWpm: 45,
        targetAccuracy: 96,
        content: "Every letter of the alphabet, fast and clean.",
        practiceText: [
          "The quick brown fox jumps over the lazy dog.",
          "Pack my box with five dozen jugs.",
          "The five boxing wizards jump quickly.",
          "How quickly daft jumping zebras vex!"
        ],
        keyFocus: ["q", "z", "x", "j"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 115 },
      },
      {
        id: "lesson-9-3",
        title: "Mixed review",
        description: "A little of everything the path has taught.",
        theme: { focusLabel: "Keys: ; \" ( )", tip: "A little of everything the path has taught." },
        targetWpm: 42,
        targetAccuracy: 97,
        content: "A little of everything the path has taught.",
        practiceText: [
          "Review: 3 lessons, 2 checkpoints, 1 goal.",
          "\"Done,\" she said, \"and done well.\"",
          "total += count * (rate / 100);",
          "Steady hands, clear mind, clean lines."
        ],
        keyFocus: [";", "\"", "(", ")"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 90 },
      },
    ],
  },
  {
    id: "unit-10-graduation",
    title: "Graduation",
    description: "Prove the skill and set a record.",
    theme: { tagline: "Prove it, then keep it.", skillFocus: "Final passage and personal best", icon: "graduation" },
    lessons: [
      {
        id: "lesson-10-1",
        title: "Final passage",
        description: "The last passage on the path.",
        theme: { focusLabel: "Keys: a e t", tip: "You have typed every one of these keys before." },
        targetWpm: 50,
        targetAccuracy: 99,
        content: "The last passage on the path.",
        practiceText: [
          "This passage marks the end of the path and the start of something better: typing that no longer gets in the way of what you want to say. You reached every key, kept your accuracy high, and built a rhythm that holds under pressure. Keep practicing a few minutes a day, and the skill will stay with you for life."
        ],
        keyFocus: ["a", "e", "t"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 100 },
      },
      {
        id: "lesson-10-2",
        title: "Personal best",
        description: "Come back any time to set a new record.",
        theme: { focusLabel: "Keys: a e t", tip: "Come back to this one whenever you want a new record." },
        targetWpm: 55,
        targetAccuracy: 99.5,
        content: "Come back any time to set a new record.",
        practiceText: [
          "Set a target, beat it, and set another. The fastest typists are not the ones who rush; they are the ones who stopped making mistakes and then let the speed come on its own."
        ],
        keyFocus: ["a", "e", "t"],
        estimatedTime: 2,
        difficulty: 5,
        rewards: { xp: 150 },
      },
    ],
  },
];

/** Unit number from its id (unit-<n>-<slug>). */
export function unitNumber(unit: Pick<CurriculumUnit, 'id'>): number {
  return parseInt(unit.id.split('-')[1], 10);
}

/** Every curriculum lesson in path order. */
export const allCurriculumLessons: CurriculumLesson[] = gamifiedCurriculum.flatMap((u) => u.lessons);

/** Locate a curriculum lesson and its unit by lesson id. */
export function findCurriculumLesson(id: string):
  | { lesson: CurriculumLesson; unit: CurriculumUnit; unitIndex: number; lessonIndex: number }
  | undefined {
  for (let unitIndex = 0; unitIndex < gamifiedCurriculum.length; unitIndex++) {
    const unit = gamifiedCurriculum[unitIndex];
    const lessonIndex = unit.lessons.findIndex((l) => l.id === id);
    if (lessonIndex >= 0) return { lesson: unit.lessons[lessonIndex], unit, unitIndex, lessonIndex };
  }
  return undefined;
}
