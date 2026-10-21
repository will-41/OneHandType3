// Comprehensive Gamified One-Hand Typing Curriculum
// Based on research from SRA Lab, Duolingo gamification studies, and accessibility education best practices

export interface CurriculumLesson {
  id: string;
  title: string;
  description: string;
  storyTheme: {
    character: string;
    guild: string;
    location: string;
    storyContext: string;
    flavorText: string;
  };
  skills: string[];
  targetWpm: number;
  targetAccuracy: number;
  content: string;
  practiceText: string[];
  keyFocus: string[];
  estimatedTime: number; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  unlockRequirements: {
    wpm?: number;
    accuracy?: number;
    previousLessons?: string[];
    practiceTime?: number;
  };
  rewards: {
    xp: number;
    coins: number;
    achievements?: string[];
    unlocks?: string[];
  };
  adaptiveFeatures: {
    fatiguePrevention: boolean;
    difficultyScaling: boolean;
    customPacing: boolean;
  };
}

export interface CurriculumLevel {
  id: string;
  title: string;
  description: string;
  storyTheme: {
    region: string;
    storyline: string;
    characterArc: string;
    majorQuest: string;
  };
  lessons: CurriculumLesson[];
  levelRewards: {
    title: string;
    badge: string;
    keyboardTheme?: string;
    layoutUnlock?: string;
    specialFeatures?: string[];
  };
  unlockRequirements: {
    previousLevel?: string;
    minimumWpm: number;
    minimumAccuracy: number;
    completionPercentage: number;
  };
  estimatedCompletionTime: string; // "1-2 weeks"
  accessibilityFocus: string[];
}

// Realm of Keys Curriculum: 10 Comprehensive Levels
export const gamifiedCurriculum: CurriculumLevel[] = [
  {
    id: "level-1-hearthlands",
    title: "The Hearthlands Basics: The Emberkeepers' Foundation",
    description: "Begin your typing journey in the warm Hearthlands, where patience and steady hands matter most. Learn the fundamental keys under the watchful eyes of the Emberkeepers.",
    storyTheme: {
      region: "The Hearthlands",
      storyline: "Begin your typing journey in the warm Hearthlands, where patience and steady hands matter most. Learn the fundamental keys under the watchful eyes of the Emberkeepers.",
      characterArc: "Mira Lanternwick's guidance",
      majorQuest: "Learn the home row position where your fingers rest, like the warm Hearthstone at the heart of the Hollow."
    },
    lessons: [
      {
        id: "lesson-1-1",
        title: "Home Position: The Hearthstone",
        description: "Learn the home row position where your fingers rest, like the warm Hearthstone at the center of Hearthstone Hollow.",
        storyTheme: {
          character: "Mira Lanternwick",
          guild: "Emberkeepers",
          location: "Hearthstone Hollow",
          storyContext: "Place your hands on the keyboard as Mira rests her palms on the Hearthstone before every lesson",
          flavorText: "Steady hands light every path."
        },
        skills: ["Home row positioning", "Finger placement", "Posture"],
        targetWpm: 5,
        targetAccuracy: 90.00,
        content: "Basic finger positioning on F and J keys",
        practiceText: [
          "asdf jkl;",
          "fjfj fjfj fjfj",
          "asdf jkl; asdf jkl;",
          "ff jj ff jj dd kk dd kk"
        ],
        keyFocus: ["f", "j", "d", "k", "s", "l", "a", ";"],
        estimatedTime: 10,
        difficulty: 1,
        prerequisites: [],
        unlockRequirements: {
          previousLessons: ["Complete tutorial"]
        },
        rewards: {
          xp: 10,
          coins: 5,
          achievements: ["Ember Badge"],
          unlocks: ["10 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-1-2",
        title: "The Ember Words: Kindling Your Vocabulary",
        description: "Type the first words of the Emberkeepers and learn basic letter combinations that glow like a growing fire.",
        storyTheme: {
          character: "Tobin Reedwhistle",
          guild: "Emberkeepers",
          location: "Kindling Gate",
          storyContext: "Practice typing with the focus and care that Tobin brings to tending the Kindling Gate lanterns.",
          flavorText: "Start small, keep it steady, and the fire will grow."
        },
        skills: ["Letter combinations", "Word formation", "Rhythm"],
        targetWpm: 8,
        targetAccuracy: 85.00,
        content: "Basic words and Emberkeeper phrases",
        practiceText: [
          "warm ember glow",
          "wire the tiny motor",
          "come grow in time",
          "calm minds win"
        ],
        keyFocus: ["w", "i", "n", "t", "e", "r", "c", "o", "m", "g"],
        estimatedTime: 15,
        difficulty: 2,
        prerequisites: ["lesson-1-1"],
        unlockRequirements: {
          previousLessons: ["Complete Home Position lesson"],
          wpm: 5
        },
        rewards: {
          xp: 20,
          coins: 15,
          achievements: ["First Flame Badge"],
          unlocks: ["15 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-1-3",
        title: "Tobin's Tricky Letters",
        description: "Master the challenging letter combinations, proving yourself ready for bigger journeys, just as Tobin grew from lamplighter's apprentice to Keeper of the Gate.",
        storyTheme: {
          character: "Tobin Reedwhistle",
          guild: "Emberkeepers",
          location: "Lantern Tower",
          storyContext: "Rise through dedication and practice, as Tobin rose from apprentice to Keeper of the Gate",
          flavorText: "Every hard letter conquered is another lantern lit."
        },
        skills: ["Complex combinations", "Speed building", "Accuracy under pressure"],
        targetWpm: 12,
        targetAccuracy: 88.00,
        content: "Advanced letter patterns and combinations",
        practiceText: [
          "buzzy yellow puzzle",
          "quiz the lazy box",
          "pry open the jar",
          "quartz byte maze"
        ],
        keyFocus: ["b", "u", "y", "p", "q", "x", "z"],
        estimatedTime: 20,
        difficulty: 3,
        prerequisites: ["lesson-1-2"],
        unlockRequirements: {
          accuracy: 85,
          wpm: 0,
          previousLessons: [],
          practiceTime: 0
        },
        rewards: {
          xp: 30,
          coins: 20,
          achievements: ["Lantern Cloak"],
          unlocks: ["20 Honor Points", "Emberglass Charm"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Hearthlands Rewards",
      badge: "Emberkeeper Banner",
      keyboardTheme: "ember_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Hearthstone Hollow Badge", "50 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "Complete Tutorial",
      minimumWpm: 0,
      minimumAccuracy: 0,
      completionPercentage: 0
    },
    estimatedCompletionTime: "45 minutes",
    accessibilityFocus: ["Large text options", "High contrast mode", "Finger position guides"]
  },
  {
    id: "level-2-silverflow",
    title: "The Silverflow Delta: The Tidewrights' Grace",
    description: "Flow like the channels of the Silverflow, where the Tidewrights guide boats and words with equal grace. Master fluid typing movements.",
    storyTheme: {
      region: "The Silverflow Delta",
      storyline: "Master fluid typing movements like the winding channels of the Silverflow",
      characterArc: "Learn to adapt your typing style to flow smoothly between keys",
      majorQuest: "Complete all delta typing challenges with accuracy and speed"
    },
    lessons: [
      {
        id: "lesson-2-1",
        title: "Silverflow Streams: Common Words",
        description: "Let your fingers flow like the many streams of the Silverflow, mastering common English words with fluid grace.",
        storyTheme: {
          character: "Corin Marshwater",
          guild: "Tidewrights",
          location: "Marshwater Landing",
          storyContext: "Type with the calm wisdom and flow of Corin's river-pilot guidance",
          flavorText: "Let your fingers flow like the many streams of the Silverflow"
        },
        skills: ["Common word patterns", "Finger flow", "Typing rhythm"],
        targetWpm: 15,
        targetAccuracy: 90.00,
        content: "Most frequently used English words",
        practiceText: [
          "the and for are but not",
          "you with all any may can",
          "had her was one our out",
          "day get use man new now"
        ],
        keyFocus: ["all letters", "focus on common patterns"],
        estimatedTime: 25,
        difficulty: 4,
        prerequisites: ["lesson-1-3"],
        unlockRequirements: {
          previousLessons: ["Complete lesson-1-3"]
        },
        rewards: {
          xp: 50,
          coins: 25,
          achievements: ["Silver Minnow Badge"],
          unlocks: ["50 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-2-2",
        title: "Millbrook Crossing: Word Combinations",
        description: "Work alongside Edda Millbrook at the old mill bridge, connecting words like planks across a rushing river.",
        storyTheme: {
          character: "Edda Millbrook",
          guild: "Tidewrights",
          location: "Millbrook Bridge",
          storyContext: "Connect your words as Edda connects the delta towns with her bridge",
          flavorText: "The bridge builder's care in every keystroke."
        },
        skills: ["Word transitions", "Speed consistency", "Strategic typing"],
        targetWpm: 18,
        targetAccuracy: 88.00,
        content: "Multi-word combinations and phrases",
        practiceText: [
          "teamwork builds the crossing",
          "millbrook bridge stands strong",
          "silverflow waters never rest",
          "edda millbrook bridge builder"
        ],
        keyFocus: ["word spacing", "transition smoothness"],
        estimatedTime: 25,
        difficulty: 3,
        prerequisites: ["lesson-2-1"],
        unlockRequirements: {
          accuracy: 90
        },
        rewards: {
          xp: 30,
          coins: 25,
          achievements: ["Stone Bridge Badge", "Bridge Captain Title"],
          unlocks: ["30 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-2-3",
        title: "Fenwick's Steady Navigation",
        description: "Master careful navigation like Captain Orla Fenwick, who steers through the delta fog, combining speed with steady accuracy.",
        storyTheme: {
          character: "Orla Fenwick",
          guild: "Tidewrights",
          location: "Fenwick Lighthouse",
          storyContext: "Steer with the precision of a captain who never loses her heading",
          flavorText: "A steady hand on the tiller keeps every keystroke on course."
        },
        skills: ["Navigation typing", "Precision under pressure", "Steady efficiency"],
        targetWpm: 20,
        targetAccuracy: 92.00,
        content: "Navigation orders and harbor commands",
        practiceText: [
          "steer clear of the sandbar",
          "fenwick never loses her heading",
          "teamwork and care above all else",
          "the old pilot holds her course"
        ],
        keyFocus: ["navigation patterns", "steady precision"],
        estimatedTime: 30,
        difficulty: 3,
        prerequisites: ["lesson-2-2"],
        unlockRequirements: {
          accuracy: 88
        },
        rewards: {
          xp: 40,
          coins: 30,
          achievements: ["Lighthouse Badge"],
          unlocks: ["35 Honor Points", "Navigator's Medal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Silverflow Rewards",
      badge: "Tidewright Seal",
      keyboardTheme: "tidewright_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Silverflow Map", "90 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "Complete Level 1",
      minimumWpm: 0,
      minimumAccuracy: 0,
      completionPercentage: 0
    },
    estimatedCompletionTime: "75 minutes",
    accessibilityFocus: ["Flow visualization", "Rhythm indicators", "Smooth transitions"]
  },
  {
    id: "level-3-bloomvale",
    title: "The Bloomvale Orchards: The Orchard Wardens' Garden",
    description: "Flourish like the blossoming orchards of Bloomvale, where the Orchard Wardens cultivate both gardens and sentences with equal beauty.",
    storyTheme: {
      region: "Bloomvale",
      storyline: "Flourish like the blossoming orchards of Bloomvale, where the Orchard Wardens cultivate both gardens and sentences with equal beauty.",
      characterArc: "Develop typing skills with the grace and refinement of the Orchard Wardens",
      majorQuest: "Master complex sentence structures and punctuation like the fertile orchards of Bloomvale"
    },
    lessons: [
      {
        id: "lesson-3-1",
        title: "Orchard Blossom Sentences",
        description: "Type complete sentences with proper punctuation, blooming like the first blossoms in the Bloomvale Orchards.",
        storyTheme: {
          character: "Rosalind Thornfield",
          guild: "Orchard Wardens",
          location: "Thornfield Manor",
          storyContext: "Write with the grace and quiet strength Rosalind shows when tending the orchards",
          flavorText: "Growing strong through seasons of plenty and want."
        },
        skills: ["Complete sentences", "Punctuation", "Capitalization"],
        targetWpm: 20,
        targetAccuracy: 92.00,
        content: "Full sentences with proper punctuation",
        practiceText: [
          "The golden blossoms open in Bloomvale's fertile soil.",
          "Rosalind Thornfield speaks with grace and quiet strength.",
          "Growing strong through seasons of plenty and want.",
          "The Orchards feed the Ten Realms with abundance."
        ],
        keyFocus: ["periods", "commas", "capitalization", "apostrophes"],
        estimatedTime: 30,
        difficulty: 3,
        prerequisites: ["lesson-2-3"],
        unlockRequirements: {
          previousLessons: ["Complete Level 2"]
        },
        rewards: {
          xp: 40,
          coins: 30,
          achievements: ["Golden Blossom"],
          unlocks: ["40 Honor Points", "Orchard Gate Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-3-2",
        title: "Willowby's Sharp Wit: Complex Phrases",
        description: "Handle winding sentences with the sharp wit Granny Willowby is famous for.",
        storyTheme: {
          character: "Granny Willowby",
          guild: "Orchard Wardens",
          location: "Willowby Greenhouse",
          storyContext: "Handle winding sentences with the sharp wit Granny Willowby is famous for",
          flavorText: "Sharp wit and sharp shears keep the garden tidy."
        },
        skills: ["Complex sentences", "Advanced punctuation", "Literary flow"],
        targetWpm: 22,
        targetAccuracy: 90.00,
        content: "Complex sentences with multiple clauses",
        practiceText: [
          "\"I planned it all along,\" said Granny Willowby with satisfaction.",
          "The brambles have thorns, and the orchard has seasons within seasons.",
          "Growing strong means adapting, surviving, and eventually thriving.",
          "What good is a harvest if you cannot share it with those you love?"
        ],
        keyFocus: ["quotation marks", "complex punctuation", "varied sentence structure"],
        estimatedTime: 35,
        difficulty: 4,
        prerequisites: ["lesson-3-1"],
        unlockRequirements: {
          accuracy: 92
        },
        rewards: {
          xp: 50,
          coins: 35,
          achievements: ["Sharp Shears Crown"],
          unlocks: ["50 Honor Points", "Sharp Wit Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-3-3",
        title: "Fernsby the Festival Champion",
        description: "Move with elegance and speed, like Pip Fernsby, champion of the Harvest Festival contests.",
        storyTheme: {
          character: "Pip Fernsby",
          guild: "Orchard Wardens",
          location: "Harvest Fairgrounds",
          storyContext: "Move with elegance and speed, as Pip does in the Harvest Festival contests",
          flavorText: "Grace and speed can go hand in hand."
        },
        skills: ["Elegant flow", "Festival speed", "Graceful accuracy"],
        targetWpm: 25,
        targetAccuracy: 94.00,
        content: "Festival contests and champion's valor",
        practiceText: [
          "The Festival Champion moves with unmatched grace and skill.",
          "In contest and celebration, elegance meets precise timing.",
          "A blossom by any other name would smell as sweet.",
          "True mastery combines strength with beauty and care."
        ],
        keyFocus: ["elegant patterns", "flowing combinations", "festival rhythm"],
        estimatedTime: 25,
        difficulty: 4,
        prerequisites: ["lesson-3-2"],
        unlockRequirements: {
          accuracy: 90
        },
        rewards: {
          xp: 55,
          coins: 40,
          achievements: ["Festival Champion Ribbon"],
          unlocks: ["45 Honor Points", "Harvest Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Bloomvale Rewards",
      badge: "Orchard Warden Crest",
      keyboardTheme: "orchard_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Bloomvale Map", "135 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "Complete Level 2",
      minimumWpm: 0,
      minimumAccuracy: 0,
      completionPercentage: 0
    },
    estimatedCompletionTime: "90 minutes",
    accessibilityFocus: ["Sentence structure guides", "Punctuation helpers", "Grammar support"]
  },
  {
    id: "level-4-gildmoor",
    title: "Gildmoor's Ledgers: The Ledgerkeepers' Gold",
    description: "Type with the precision of a master accountant, mastering numbers, symbols, and the wealth of characters.",
    storyTheme: {
      region: "Gildmoor",
      storyline: "Type with the precision of a master accountant, mastering numbers, symbols, and the wealth of characters.",
      characterArc: "Tamsin's Growth and Vesper's Ambition",
      majorQuest: "Master the Gildmoor ledger calculations"
    },
    lessons: [
      {
        id: "lesson-4-1",
        title: "Goldsworth Ledgers: Numbers and Symbols",
        description: "Count with the calm accuracy of a seasoned ledgerkeeper, mastering the number row and everyday symbols.",
        storyTheme: {
          character: "Tamsin Goldsworth",
          guild: "Ledgerkeepers",
          location: "Goldsworth Counting House",
          storyContext: "Count with the calm accuracy of a seasoned ledgerkeeper",
          flavorText: "Every digit has its place."
        },
        skills: ["Number row mastery", "Special characters", "Financial notation"],
        targetWpm: 18,
        targetAccuracy: 88.00,
        content: "Numbers, symbols, and financial calculations",
        practiceText: [
          "The Guild Bank: 1,000,000 silver marks @ 3% interest",
          "Goldsworth mines: $500,000 per year (est. 2024)",
          "Debt to Guild: 3,500,000 marks + 12% penalty",
          "A Gildmoor ledger balances: 100% of accounts, 0% tolerance for errors"
        ],
        keyFocus: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
        estimatedTime: 25,
        difficulty: 3,
        prerequisites: ["lesson-3-3"],
        unlockRequirements: {
          previousLessons: ["Complete Level 3"]
        },
        rewards: {
          xp: 45,
          coins: 35,
          achievements: ["Golden Ledger"],
          unlocks: ["45 Honor Points", "Counting House Seal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-4-2",
        title: "Brassgate Schemes: Special Characters",
        description: "Master the strange symbols of the Exchange's trading code, from brackets and braces to slashes and pipes.",
        storyTheme: {
          character: "Vesper Brassgate",
          guild: "Ledgerkeepers",
          location: "Clockwork Exchange",
          storyContext: "Master the strange symbols of the Exchange's trading code",
          flavorText: "The market rewards the careful and punishes the sloppy."
        },
        skills: ["Advanced symbols", "Keyboard mastery", "Complex notation"],
        targetWpm: 20,
        targetAccuracy: 85.00,
        content: "Programming symbols and advanced punctuation",
        practiceText: [
          "if (profit >= target) { ledger.close(); } else { ledger.audit++; }",
          "The Exchange motto: \"Value = Trust && Trust != Luck\"",
          "Guild decree #47: tariffs += 25%; merchant.delay--;",
          "Smelting formula: 2{Cu} + 1{Sn} → bronze.ingot++;"
        ],
        keyFocus: ["[", "]", "{", "}", "\\", "|", ";", ":", "'", "\"", "<", ">", "?", "/"],
        estimatedTime: 30,
        difficulty: 4,
        prerequisites: ["lesson-4-1"],
        unlockRequirements: {
          accuracy: 88
        },
        rewards: {
          xp: 55,
          coins: 40,
          achievements: ["Exchange Master's Seal"],
          unlocks: ["55 Honor Points", "Smelting Vial"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-4-3",
        title: "Hollis's Fresh Start: Precision Through Difficulty",
        description: "Turn hard-won practice into mastery, as Hollis Gildmere rebuilt a trade from nothing.",
        storyTheme: {
          character: "Hollis Gildmere",
          guild: "Ledgerkeepers",
          location: "Debtors' Row",
          storyContext: "Turn hard-won practice into mastery, as Hollis rebuilt a trade from nothing",
          flavorText: "Honest effort is the best currency."
        },
        skills: ["Redemptive accuracy", "Complex symbol mastery", "Honor under pressure"],
        targetWpm: 23,
        targetAccuracy: 90.00,
        content: "Complex programming and mathematical notation",
        practiceText: [
          "function honestWork() { return (actions.filter(deed => deed.isFair)).length; }",
          "The gilded hand: Math.pow(skill, 2) + patience * effort = true_worth",
          "Hollis taught me: honesty !== luck && courage > reputation",
          "A trader's true test: (loyalty && courage && honesty) || redemption.earned"
        ],
        keyFocus: ["complex symbols", "programming logic", "mathematical notation"],
        estimatedTime: 35,
        difficulty: 5,
        prerequisites: ["lesson-4-2"],
        unlockRequirements: {
          accuracy: 85
        },
        rewards: {
          xp: 65,
          coins: 45,
          achievements: ["Fresh Start Medal"],
          unlocks: ["60 Honor Points", "Golden Abacus"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Ledgerkeeper Golden Seal",
      badge: "Gildmoor Gold Seal",
      specialFeatures: ["160 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "Complete Level 3",
      minimumWpm: 0,
      minimumAccuracy: 0,
      completionPercentage: 0
    },
    estimatedCompletionTime: "90 minutes",
    accessibilityFocus: ["Symbol guides", "Number row helpers", "Financial formatting"]
  },
  {
    id: "level-5-stormcrest",
    title: "The Stormcrest Coast: The Stormwardens' Power",
    description: "Channel the fury of thunderstorms and the strength of the open sea, typing with the raw power and speed of the Stormwardens.",
    storyTheme: {
      region: "The Stormcrest Coast",
      storyline: "Channel the fury of thunderstorms and the strength of the open sea, typing with the raw power and speed of the Stormwardens.",
      characterArc: "Develop powerful typing techniques with the strength of the Stormwardens",
      majorQuest: "Master high-speed typing challenges like the storms of the Stormcrest Coast"
    },
    lessons: [
      {
        id: "lesson-5-1",
        title: "Thunderhale Battle Commands",
        description: "Type with bold, fast energy, as Captain Brann Thunderhale rallies the fleet before a storm.",
        storyTheme: {
          character: "Brann Thunderhale",
          guild: "Stormwardens",
          location: "Stormcrest Harbor",
          storyContext: "Type with bold, fast energy, as Brann rallies the fleet before a storm",
          flavorText: "Ride the thunder, don't fear it."
        },
        skills: ["Speed bursts", "Command typing", "Battle rhythm"],
        targetWpm: 25,
        targetAccuracy: 87.00,
        content: "Fleet commands and storm scenarios",
        practiceText: [
          "CHARGE! Forward the fleet! Break the waves!",
          "Sound the horns! Rally to the beacon banner!",
          "Hold the line! Stand fast! Ours is the thunder!",
          "Victory or bust! For Stormcrest! For the coast!"
        ],
        keyFocus: ["speed building", "all caps typing", "exclamation points"],
        estimatedTime: 20,
        difficulty: 4,
        prerequisites: ["lesson-4-3"],
        unlockRequirements: {
          previousLessons: ["Complete lesson-4-3"],
          accuracy: 90
        },
        rewards: {
          xp: 50,
          coins: 25,
          achievements: ["Storm Hammer", "Storm Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-5-2",
        title: "Greycliff's Resolve: Precision Under Pressure",
        description: "Keep your accuracy perfect while the pressure builds, like Warden Isolde Greycliff keeping the beacon burning through a gale.",
        storyTheme: {
          character: "Isolde Greycliff",
          guild: "Stormwardens",
          location: "Beacon Cliff",
          storyContext: "Keep your accuracy perfect while the pressure builds, as Isolde keeps the beacon burning",
          flavorText: "A steady flame in a howling gale."
        },
        skills: ["Accuracy under pressure", "Timed challenges", "Unwavering focus"],
        targetWpm: 30,
        targetAccuracy: 95.00,
        content: "Legal documents and precise declarations",
        practiceText: [
          "By right of the charter and the vote, I am the rightful keeper of this lighthouse.",
          "Fairness must be served, regardless of personal cost or consequence.",
          "The rule is the rule. A good deed does not erase a broken promise.",
          "I will not become a footnote in someone else's logbook."
        ],
        keyFocus: ["precision", "legal formatting", "formal language"],
        estimatedTime: 35,
        difficulty: 5,
        prerequisites: ["lesson-5-1"],
        unlockRequirements: {
          wpm: 25,
          accuracy: 87,
          previousLessons: ["lesson-5-1"]
        },
        rewards: {
          xp: 65,
          coins: 30,
          achievements: ["Beacon Keeper Crown"],
          unlocks: ["Beaconlight Lantern"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-5-3",
        title: "Galewind's Flair: Speed with Style",
        description: "Type with charm and speed, like Dash Galewind dazzling the crowd at the harbor festival.",
        storyTheme: {
          character: "Dash Galewind",
          guild: "Stormwardens",
          location: "Galewind Gardens",
          storyContext: "Type with charm and speed, as Dash dazzles the crowd at the harbor festival",
          flavorText: "Make every keystroke look easy."
        },
        skills: ["Charismatic speed", "Style with substance", "Inspirational typing"],
        targetWpm: 32,
        targetAccuracy: 89.00,
        content: "Inspirational speeches and charismatic declarations",
        practiceText: [
          "A leader should be strong, brave, and trusted by the crew.",
          "Why should the helm be a burden when it could be a joy?",
          "The coast needs a captain who inspires hope, not fear.",
          "Together we can build a harbor of prosperity and peace."
        ],
        keyFocus: ["inspirational flow", "charismatic rhythm", "crowd-pleasing pace"],
        estimatedTime: 25,
        difficulty: 4,
        prerequisites: ["lesson-5-2"],
        unlockRequirements: {
          accuracy: 95,
          previousLessons: ["lesson-5-2"]
        },
        rewards: {
          xp: 100,
          coins: 55,
          achievements: ["Charisma Crown"],
          unlocks: ["Festival Ribbon Cloak", "55 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Stormwarden Thunder Crown",
      badge: "Stormcrest Banner",
      specialFeatures: ["170 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-4-gildmoor",
      minimumWpm: 20,
      minimumAccuracy: 85,
      completionPercentage: 100
    },
    estimatedCompletionTime: "80 minutes",
    accessibilityFocus: ["Speed indicators", "Pressure management", "Focus tools"]
  },
  {
    id: "level-6-skyreach",
    title: "Skyreach Heights: The Cloudwatchers' Honor",
    description: "Reach new heights of typing excellence in the Skyreach Citadel, where honor and precision soar as high as eagles.",
    storyTheme: {
      region: "Skyreach Peaks",
      storyline: "Reach new heights of typing excellence in the Skyreach Citadel, where honor and precision soar as high as eagles.",
      characterArc: "Master advanced typing techniques with the noble honor of the Cloudwatchers",
      majorQuest: "Achieve perfect typing accuracy through honor and dedication"
    },
    lessons: [
      {
        id: "lesson-6-1",
        title: "Highcrest Honor Code",
        description: "Hold yourself to the Cloudwatchers' standard of accuracy at every height, guided by Elder Aldric Highcrest.",
        storyTheme: {
          character: "Aldric Highcrest",
          guild: "Cloudwatchers",
          location: "Skyreach Citadel",
          storyContext: "Hold yourself to the Cloudwatchers' standard of accuracy at every height",
          flavorText: "Aim high, type true."
        },
        skills: ["Advanced techniques", "Honor-bound accuracy", "Noble speed"],
        targetWpm: 35,
        targetAccuracy: 93.00,
        content: "Advanced passages about honor and nobility",
        practiceText: [
          "Honor is not a luxury that can be set aside when convenient.",
          "Skyreach Citadel stands unshaken because some heights cannot be reached by force.",
          "As high as honor means there is no ceiling to moral excellence.",
          "True nobility comes not from birth, but from actions in service of others."
        ],
        keyFocus: ["advanced patterns", "noble language", "complex structures"],
        estimatedTime: 40,
        difficulty: 4,
        prerequisites: ["lesson-5-3"],
        unlockRequirements: {
          wpm: 30,
          accuracy: 90,
          previousLessons: ["lesson-5-3"]
        },
        rewards: {
          xp: 60,
          coins: 25,
          achievements: ["Cloudwatcher Feather"],
          unlocks: ["Summit Gate Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-6-2",
        title: "Maren's Shelter: Defensive Typing",
        description: "Type with steady, protective care, as Maren Cloudhollow shelters travelers from the mountain storms.",
        storyTheme: {
          character: "Maren Cloudhollow",
          guild: "Cloudwatchers",
          location: "Cloudhollow Aerie",
          storyContext: "Type with steady, protective care, as Maren shelters travelers from the mountain storms",
          flavorText: "A safe harbor in the highest place."
        },
        skills: ["Defensive accuracy", "Protective precision", "Maternal consistency"],
        targetWpm: 28,
        targetAccuracy: 96.00,
        content: "Protective declarations and maternal wisdom",
        practiceText: [
          "A mother's love knows no bounds, no limits, no compromise.",
          "The shelter door opens for every traveler caught in the storm.",
          "In the highest village, the most precious things are kept safe.",
          "Protection sometimes requires hard choices and unwavering resolve."
        ],
        keyFocus: ["defensive patterns", "protective accuracy", "consistency"],
        estimatedTime: 30,
        difficulty: 4,
        prerequisites: ["lesson-6-1"],
        unlockRequirements: {
          wpm: 32,
          accuracy: 93,
          previousLessons: ["lesson-6-1"]
        },
        rewards: {
          xp: 45,
          coins: 20,
          achievements: ["Protective Guardian Badge"],
          unlocks: ["Shelter Door Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-6-3",
        title: "Wren's Flight: Learning to Soar",
        description: "Take your first confident leaps, as young Wren Highcrest does from the training ledge.",
        storyTheme: {
          character: "Wren Highcrest",
          guild: "Cloudwatchers",
          location: "Aerie Training Ledge",
          storyContext: "Take your first confident leaps, as Wren does from the training ledge",
          flavorText: "Trust the wind, trust your fingers."
        },
        skills: ["Soaring speed", "Confident flight", "Advanced patterns"],
        targetWpm: 38,
        targetAccuracy: 91.00,
        content: "Flight metaphors and soaring achievements",
        practiceText: [
          "The young eagle learns to spread his wings and trust the wind.",
          "Every flight begins with a leap of faith from the nest.",
          "Soaring high requires courage to leave the safety of the ground.",
          "Skyreach teaches that the highest peaks offer the clearest view."
        ],
        keyFocus: ["soaring patterns", "flight rhythm", "confident speed"],
        estimatedTime: 35,
        difficulty: 5,
        prerequisites: ["lesson-6-2"],
        unlockRequirements: {
          wpm: 34,
          accuracy: 96,
          previousLessons: ["lesson-6-2"]
        },
        rewards: {
          xp: 65,
          coins: 30,
          achievements: ["Soaring Wings"],
          unlocks: ["Flight Master Title"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Cloudwatcher Eagle Banner",
      badge: "Citadel Seal",
      specialFeatures: ["170 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-5-stormcrest",
      minimumWpm: 25,
      minimumAccuracy: 87,
      completionPercentage: 100
    },
    estimatedCompletionTime: "105 minutes",
    accessibilityFocus: ["Height metaphors", "Honor visualization", "Eagle-eye precision"]
  },
  {
    id: "level-7-sunscar",
    title: "The Sunscar Patience: The Sandwalkers' Endurance",
    description: "Develop the patient endurance of the desert travelers, typing long passages with the steady persistence of the desert sun.",
    storyTheme: {
      region: "The Sunscar Expanse",
      storyline: "Develop the patient endurance of the desert travelers, typing long passages with the steady persistence of the desert sun.",
      characterArc: "Build typing endurance like the tireless Sandwalkers",
      majorQuest: "Master extended typing sessions with sustained accuracy"
    },
    lessons: [
      {
        id: "lesson-7-1",
        title: "Dustwalker Patience: Extended Passages",
        description: "Build endurance on long passages, as Rhea Dustwalker does crossing the dunes one steady step at a time.",
        storyTheme: {
          character: "Rhea Dustwalker",
          guild: "Sandwalkers",
          location: "Sunscar Oasis",
          storyContext: "Build endurance as Rhea does crossing the dunes, one steady step at a time",
          flavorText: "The desert rewards those who keep walking."
        },
        skills: ["Endurance typing", "Sustained accuracy", "Desert patience"],
        targetWpm: 32,
        targetAccuracy: 91.00,
        content: "Extended passages about the Sunscar and endurance",
        practiceText: [
          "Rhea was patient when she needed to be, moving only when the heat of the day had passed. The Sunscar had been crossed for generations through patience, persistence, and the careful use of every drop of water.",
          "Steady, steady, steady - these words echo across the red mesas and the wide dunes of the Sunscar. Every traveler who has ever reached the far oasis learned that speed without care leaves you stranded in the sand.",
          "The Sandwalkers move like water in the desert - slow, careful, and conserving energy for the moment when a burst of effort is required. Every step is measured and every breath is deliberate, from the first light of morning until the last.",
          "The desert teaches patience to those who would cross it. The sun rises and sets, the dunes shift but never break, and the Sandwalkers go on as they always have, one steady keystroke after another."
        ],
        keyFocus: ["endurance", "consistency", "extended accuracy"],
        estimatedTime: 50,
        difficulty: 4,
        prerequisites: ["lesson-6-3"],
        unlockRequirements: {
          wpm: 30,
          accuracy: 88,
          previousLessons: ["lesson-6-3"]
        },
        rewards: {
          xp: 70,
          coins: 35,
          achievements: ["Sandwalker Spear"],
          unlocks: ["Desert Sun"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-7-2",
        title: "Solenne's Strategy: Strategic Complexity",
        description: "Plan several moves ahead, as Solenne Amberwind does when she routes the great caravans across the Sunscar.",
        storyTheme: {
          character: "Solenne Amberwind",
          guild: "Sandwalkers",
          location: "Amberwind Oasis",
          storyContext: "Plan several moves ahead as Solenne does when she routes the great caravans",
          flavorText: "Think three steps ahead, type one step at a time."
        },
        skills: ["Strategic complexity", "Advanced planning", "Intricate patterns"],
        targetWpm: 30,
        targetAccuracy: 94.00,
        content: "Strategic planning and complex political maneuvering",
        practiceText: [
          "Trade is played in the Sunscar by different rules than in the rest of the realms.",
          "Solenne weaves plans within plans, each move calculated for maximum advantage.",
          "In the Oasis Gardens, children learn that strategy begins with understanding the landscape.",
          "The Sunscar's strength lies not in armies, but in the clever minds of its caravan leaders."
        ],
        keyFocus: ["strategic patterns", "complex planning", "political precision"],
        estimatedTime: 35,
        difficulty: 5,
        prerequisites: ["lesson-7-1"],
        unlockRequirements: {
          wpm: 32,
          accuracy: 90,
          previousLessons: ["lesson-7-1"]
        },
        rewards: {
          xp: 55,
          coins: 25,
          achievements: ["Strategist's Circlet"],
          unlocks: ["Strategic Mastermind"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-7-3",
        title: "The Wayfinder Trio: Coordinated Precision",
        description: "Coordinate every skill you have, as the three wayfinders of the Mirage Flats guide caravans as one.",
        storyTheme: {
          character: "The Wayfinder Trio",
          guild: "Sandwalkers",
          location: "Mirage Flats",
          storyContext: "Coordinate every skill you have, as the three wayfinders guide caravans as one",
          flavorText: "Three guides, one steady path."
        },
        skills: ["Coordinated teamwork", "Multi-pattern mastery", "Shared precision"],
        targetWpm: 35,
        targetAccuracy: 92.00,
        content: "Coordinated teamwork and cooperation",
        practiceText: [
          "Ayla with her compass, Nessa with her lantern, Tali with her map folded in silk.",
          "The Wayfinder Trio moves as one, each complementing the others' skills.",
          "The path across the Mirage Flats is long, and we do not lose our way.",
          "We are guides of the Sunscar, and we do not hurry, we do not wander."
        ],
        keyFocus: ["coordinated patterns", "multi-skill mastery", "precise strikes"],
        estimatedTime: 30,
        difficulty: 5,
        prerequisites: ["lesson-7-2"],
        unlockRequirements: {
          wpm: 30,
          accuracy: 94,
          previousLessons: ["lesson-7-2"]
        },
        rewards: {
          xp: 60,
          coins: 30,
          achievements: ["Wayfinder Compass"],
          unlocks: ["Trio Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Sandwalker Sun Compass",
      badge: "Sunscar Expertise",
      specialFeatures: ["185 XP", "75 Coins", "Sandwalker's Route Scroll"]
    },
    unlockRequirements: {
      previousLevel: "level-6-skyreach",
      minimumWpm: 28,
      minimumAccuracy: 89,
      completionPercentage: 100
    },
    estimatedCompletionTime: "115 minutes",
    accessibilityFocus: ["Endurance pacing", "Break reminders", "Stamina indicators"]
  },
  {
    id: "level-8-tidebreak",
    title: "The Tidebreak Isles: The Saltwind Sailors' Strength",
    description: "Chart a course for mastery, typing with the relentless determination of sailors who earn their place through skill and grit.",
    storyTheme: {
      region: "The Tidebreak Isles",
      storyline: "Chart a course for mastery, typing with the relentless determination of sailors who earn their place through skill and grit.",
      characterArc: "Sailor's Resilience",
      majorQuest: "Chart the Course to Mastery"
    },
    lessons: [
      {
        id: "lesson-8-1",
        title: "Brinewick Rigging: Technical Typing",
        description: "Handle precise technical syntax the way Finn Brinewick handles a tangled rigging.",
        storyTheme: {
          character: "Finn Brinewick",
          guild: "Saltwind Sailors",
          location: "Saltspire Dock",
          storyContext: "Handle precise technical syntax as Finn handles a tangled rigging",
          flavorText: "Every knot has its place, every symbol has its job."
        },
        skills: ["Technical typing", "Code patterns", "Complex formatting"],
        targetWpm: 28,
        targetAccuracy: 89.00,
        content: "Programming code and technical documentation",
        practiceText: [
          "function payTheToll(skill) { return skill > tollPrice ? victory : defeat; }",
          "const tideGod = { motto: 'Steady hands steer true', strength: Infinity };",
          "class Sailor extends Crew { constructor() { super(); this.motto = 'We chart our own course'; } }",
          "// The Brinewick way: Earn what you can by strength, keep what you can by skill"
        ],
        keyFocus: ["coding symbols", "technical patterns", "programming syntax"],
        estimatedTime: 35,
        difficulty: 5,
        prerequisites: ["lesson-7-3"],
        unlockRequirements: {
          wpm: 35,
          accuracy: 85,
          previousLessons: ["lesson-7-3"]
        },
        rewards: {
          xp: 75,
          coins: 35,
          achievements: ["Rigging Knot Badge"],
          unlocks: ["Brass Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-8-2",
        title: "Corvane's Storm Charts: Advanced Symbols",
        description: "Decode the strange symbols of the storm charts, as Madame Corvane does every night in the Stormglass Tower.",
        storyTheme: {
          character: "Madame Corvane",
          guild: "Saltwind Sailors",
          location: "The Stormglass Tower",
          storyContext: "Decode the strange symbols of the storm charts, as Corvane does each night",
          flavorText: "Read the storm before it reads you."
        },
        skills: ["Dark symbol mastery", "Esoteric patterns", "Storm-like intensity"],
        targetWpm: 26,
        targetAccuracy: 87.00,
        content: "Complex chart notation and technical formulations",
        practiceText: [
          "const stormGlass = { power: Infinity, calm: null, signal: () => 'warning' };",
          "function tideBinding(bell) { return bell.ring() && weather.shift(); }",
          "if (glass.dial.reads(storm)) { route.alter(heading); } else { fleet.anchor(); }",
          "The Stormglass: ∞ > ∑(waves) && danger ∝ wind^∞"
        ],
        keyFocus: ["complex symbols", "mathematical notation", "advanced operators"],
        estimatedTime: 40,
        difficulty: 5,
        prerequisites: ["lesson-8-1"],
        unlockRequirements: {
          wpm: 26,
          accuracy: 89,
          previousLessons: ["lesson-8-1"]
        },
        rewards: {
          xp: 85,
          coins: 40,
          achievements: ["Stormglass Charm", "Chartmaster Seal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-8-3",
        title: "Wavecrest's Leadership: Command and Control",
        description: "Lead with clear commands, as Captain Isla Wavecrest steers the fleet through crowded waters.",
        storyTheme: {
          character: "Isla Wavecrest",
          guild: "Saltwind Sailors",
          location: "Tidebreak Fleet",
          storyContext: "Lead with clear commands as Isla steers the fleet through crowded waters",
          flavorText: "A good captain never asks the crew to do what she won't."
        },
        skills: ["Command typing", "Leadership patterns", "Fleet coordination"],
        targetWpm: 33,
        targetAccuracy: 91.00,
        content: "Naval commands and leadership directives",
        practiceText: [
          "All hands on deck! Prepare for the crossing! Show them what steady hands can do!",
          "Navigate by the stars, steer by the tide, win by superior seamanship.",
          "The Tidebreak Fleet sails under my command - follow or be left behind.",
          "Isla Wavecrest leads from the front, never asking what she won't do herself."
        ],
        keyFocus: ["command patterns", "leadership rhythm", "naval terminology"],
        estimatedTime: 30,
        difficulty: 4,
        prerequisites: ["lesson-8-2"],
        unlockRequirements: {
          wpm: 28,
          accuracy: 87,
          previousLessons: ["lesson-8-2"]
        },
        rewards: {
          xp: 70,
          coins: 30,
          achievements: ["Captain's Compass", "Fleet Command Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Saltwind Sailors' Helm",
      badge: "Tidebreak Fleet",
      specialFeatures: ["210 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-7-sunscar",
      minimumWpm: 25,
      minimumAccuracy: 85,
      completionPercentage: 100
    },
    estimatedCompletionTime: "105 minutes",
    accessibilityFocus: ["Code structure", "Technical precision", "Symbol mastery"]
  },
  {
    id: "level-9-frostmarch",
    title: "Beyond the Frostgate: The Frostwatch Vigil",
    description: "Stand guard against the storm with the Frostwatch Rangers, maintaining perfect vigilance and accuracy when stakes are highest.",
    storyTheme: {
      region: "Beyond the Frostgate",
      storyline: "Stand guard against the storm with the Frostwatch Rangers, maintaining perfect vigilance and accuracy when stakes are highest.",
      characterArc: "From Recruit to Ranger",
      majorQuest: "Defend Against the Long Storm"
    },
    lessons: [
      {
        id: "lesson-9-1",
        title: "Frostwatch Oath: The Final Vigil",
        description: "Hold perfect focus through the longest night, as Warden Halvard Coldbrook does at Frostgate Keep.",
        storyTheme: {
          character: "Halvard Coldbrook",
          guild: "Frostwatch Rangers",
          location: "Frostgate Keep",
          storyContext: "Hold perfect focus through the longest night, as Halvard keeps the beacon lit through every storm",
          flavorText: "The beacon burns brightest when the night is darkest."
        },
        skills: ["Perfect accuracy", "Ceremonial precision", "Ultimate challenge"],
        targetWpm: 40,
        targetAccuracy: 98.00,
        content: "The complete Frostwatch vigil oath and advanced challenges",
        practiceText: [
          "Snow gathers on the pass, and my vigil begins. I will keep the beacon lit through the longest night. I will read each signal with care and answer each call with a steady hand. I will not rush, I will not falter, and I will not leave my post until the thaw arrives."
        ],
        keyFocus: ["ceremonial accuracy", "sustained perfection", "oath precision"],
        estimatedTime: 60,
        difficulty: 5,
        prerequisites: ["lesson-8-3"],
        unlockRequirements: {
          wpm: 35,
          accuracy: 95,
          previousLessons: ["lesson-8-3"]
        },
        rewards: {
          xp: 100,
          coins: 50,
          achievements: ["Ranger Cloak"],
          unlocks: ["Frostsilver Blade"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-9-2",
        title: "Avalanche Alert: Crisis Typing",
        description: "Send urgent warnings with speed and accuracy, as Bram Tallow does when the pass begins to shake.",
        storyTheme: {
          character: "Bram Tallow",
          guild: "Frostwatch Rangers",
          location: "Lantern Station Nine",
          storyContext: "Send urgent warnings with speed and accuracy, as Bram does when the pass begins to shake",
          flavorText: "When seconds count, steady fingers save lives."
        },
        skills: ["Crisis management", "Emergency speed", "Life-or-death accuracy"],
        targetWpm: 45,
        targetAccuracy: 96.00,
        content: "Emergency messages and crisis communications",
        practiceText: [
          "URGENT: Avalanche approaching the pass! All messengers to the valley towns immediately!",
          "The ice moves south! Warn the lowlands! The long storm has begun!",
          "Rope and lanterns required! Rally all crews! The valleys must unite or be buried!",
          "Send word to the Summit Council: the storm of the century has come at last!"
        ],
        keyFocus: ["emergency speed", "crisis accuracy", "urgent communication"],
        estimatedTime: 25,
        difficulty: 5,
        prerequisites: ["lesson-9-1"],
        unlockRequirements: {
          wpm: 45,
          accuracy: 98,
          previousLessons: ["lesson-9-1"]
        },
        rewards: {
          xp: 115,
          coins: 60,
          achievements: ["Signal Flare Badge"],
          unlocks: ["Storm Vision"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-9-3",
        title: "The Long Thaw: Victory Through Unity",
        description: "Celebrate the end of the long storm by combining everything you have learned.",
        storyTheme: {
          character: "All Rangers United",
          guild: "All Ten Realms",
          location: "Frostgate Keep",
          storyContext: "Celebrate the end of the long storm by combining everything you have learned",
          flavorText: "Together, the realms outlast any storm."
        },
        skills: ["Victory typing", "Unified mastery", "Dawn breaking speed"],
        targetWpm: 42,
        targetAccuracy: 97.00,
        content: "Victory proclamations and the dawn of a new era",
        practiceText: [
          "The long storm is ended! The pass is clear! The thaw has come at last!",
          "Through unity of purpose and mastery of skill, the valleys have prevailed.",
          "Let it be known that courage, sacrifice, and perfect precision saved the realm.",
          "The vigil continues, but now the rangers guard a world reborn in victory and hope."
        ],
        keyFocus: ["victory rhythm", "unified precision", "dawn celebration"],
        estimatedTime: 30,
        difficulty: 5,
        prerequisites: ["lesson-9-2"],
        unlockRequirements: {
          wpm: 40,
          accuracy: 96,
          previousLessons: ["lesson-9-2"]
        },
        rewards: {
          xp: 90,
          coins: 45,
          achievements: ["Beyond the Frostgate Survival", "The True North Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "The Frostgate Defender Title",
      badge: "Frostwatch Warden-Captain Cloak",
      specialFeatures: ["270 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-8-tidebreak",
      minimumWpm: 35,
      minimumAccuracy: 95,
      completionPercentage: 100
    },
    estimatedCompletionTime: "115 minutes",
    accessibilityFocus: ["Ceremonial text support", "Oath memorization", "Perfect accuracy tools"]
  },
  {
    id: "level-10-crown-of-keys",
    title: "The Crown of Keys: Grand Keywright of Typing",
    description: "Claim the ultimate prize and take the Crown of Keys, the seat of typing mastery, ruling over all keys with absolute command.",
    storyTheme: {
      region: "The Ten Realms",
      storyline: "Claim the ultimate prize and take the Crown of Keys, the seat of typing mastery, ruling over all keys with absolute command.",
      characterArc: "From Novice to Grand Keywright",
      majorQuest: "Claim the Crown of Keys"
    },
    lessons: [
      {
        id: "lesson-10-1",
        title: "Master's Proclamations: The Master's Challenge",
        description: "Prove complete command of the keyboard with the ultimate proclamation, delivered in Crown Hall.",
        storyTheme: {
          character: "The Grand Keywright",
          guild: "The Crown of Keys",
          location: "Crown Hall",
          storyContext: "Deliver the final proclamation with total command, as the Grand Keywright does before the assembled realms",
          flavorText: "Mastery is a quiet crown."
        },
        skills: ["Absolute mastery", "Royal precision", "Supreme speed"],
        targetWpm: 50,
        targetAccuracy: 99.00,
        content: "Royal proclamations and the ultimate typing challenge",
        practiceText: [
          "By decree of the Grand Keywright of All Keys, let it be known throughout the Ten Realms of Typing that this bearer has achieved complete mastery over the keyboard, with steady hands, a clear mind, and unshakable accuracy."
        ],
        keyFocus: ["absolute mastery", "royal authority", "supreme precision"],
        estimatedTime: 90,
        difficulty: 5,
        prerequisites: ["lesson-9-3"],
        unlockRequirements: {
          wpm: 45,
          accuracy: 97,
          previousLessons: ["lesson-9-3"]
        },
        rewards: {
          xp: 100,
          coins: 50,
          achievements: ["Crown of Keys Mastery"],
          unlocks: ["Grand Decree"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-10-2",
        title: "The Eternal Legacy: Grandmaster Status",
        description: "Earn your place among the legends in the Hall of Legends with the ultimate typing challenge.",
        storyTheme: {
          character: "The Eternal Keymaster",
          guild: "The Crown of Keys",
          location: "Hall of Legends",
          storyContext: "Stand among the legends of typing as the Eternal Keymaster guides you through the final challenge",
          flavorText: "Legends are made one keystroke at a time."
        },
        skills: ["Legendary mastery", "Eternal precision", "Transcendent speed"],
        targetWpm: 55,
        targetAccuracy: 99.50,
        content: "The ultimate challenge for typing immortality",
        practiceText: [
          "In the great library of legends, where the names of typing masters echo through eternity, your achievement shall stand as a beacon of what steady practice, patience, and perseverance can accomplish."
        ],
        keyFocus: ["legendary mastery", "transcendent skill", "eternal precision"],
        estimatedTime: 120,
        difficulty: 5,
        prerequisites: ["lesson-10-1"],
        unlockRequirements: {
          wpm: 50,
          accuracy: 99,
          previousLessons: ["lesson-10-1"]
        },
        rewards: {
          xp: 150,
          coins: 75,
          achievements: ["Eternal Crown", "Grandmaster Status", "Typing Immortality"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Grand Keywright of Typing Title",
      badge: "The Crown of Keys Itself",
      keyboardTheme: "Legendary Theme",
      specialFeatures: ["700 Honor Points", "Legendary Status"]
    },
    unlockRequirements: {
      previousLevel: "level-9-frostmarch",
      minimumWpm: 50,
      minimumAccuracy: 98,
      completionPercentage: 100
    },
    estimatedCompletionTime: "210 minutes",
    accessibilityFocus: ["Ceremonial treatment", "Summit hall atmosphere", "Crown jewel precision"]
  }
];

// Adaptive Learning System
export interface AdaptiveLearningProfile {
  userId: string;
  disabilityType?: 'rsi' | 'hemiplegia' | 'mobility' | 'cognitive' | 'visual' | 'none';
  fatigueLevels: {
    current: number; // 1-10
    threshold: number; // when to suggest breaks
    pattern: number[]; // historical fatigue levels
  };
  learningPace: 'slow' | 'normal' | 'fast';
  preferredSessionLength: number; // minutes
  adaptations: {
    extendedBreaks: boolean;
    reducedTargets: boolean;
    customKeyboard: string;
    fontSize: 'normal' | 'large' | 'extra-large';
    highContrast: boolean;
  };
}

// Gamification and Rewards System
export interface RewardSystem {
  xpMultipliers: {
    perfectAccuracy: 2.0;
    speedBonus: 1.5;
    streakBonus: 1.3;
    difficultyBonus: 1.8;
  };
  achievements: {
    id: string;
    title: "The Crown of Keys: Grand Keywright of Typing"
    description: "Claim the ultimate prize and take the Crown of Keys, the seat of typing mastery, ruling over all keys with absolute command."
    requirement: string;
    xpReward: number;
    coinReward: number;
    badgeIcon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  unlockableContent: {
    themes: string[];
    layouts: string[];
    characters: string[];
    titles: string[];
  };
}

// Progress Tracking and Analytics
export interface ProgressAnalytics {
  skillProgression: {
    speed: number[];
    accuracy: number[];
    consistency: number[];    endurance: number[];
  };
  learningVelocity: number; // lessons per week
  masteryPrediction: {
    estimatedTimeToNext: string;
    confidence: number;
    recommendations: string[];
  };
  accessibilityMetrics: {
    fatigueLevel: number;
    adaptationSuccess: number;
    sessionQuality: number;
  };
}

export function calculateCurriculumProgress(
  completedLessons: string[],
  currentStats: { wpm: number; accuracy: number }
): {
  currentLevel: number;
  lessonsCompleted: number;
  totalLessons: number;
  nextMilestone: string;
  estimatedCompletion: string;
} {
  const totalLessons = gamifiedCurriculum.reduce((total, level) => total + level.lessons.length, 0);
  const currentLevel = determineCurrentLevel(completedLessons, currentStats);

  return {
    currentLevel,
    lessonsCompleted: completedLessons.length,
    totalLessons,
    nextMilestone: getNextMilestone(currentLevel, currentStats),
    estimatedCompletion: estimateTimeToCompletion(completedLessons.length, totalLessons)
  };
}

function determineCurrentLevel(completedLessons: string[], stats: { wpm: number; accuracy: number }): number {
  for (let i = 0; i < gamifiedCurriculum.length; i++) {
    const level = gamifiedCurriculum[i];
    const meetsRequirements = stats.wpm >= level.unlockRequirements.minimumWpm && 
                             stats.accuracy >= level.unlockRequirements.minimumAccuracy;

    if (!meetsRequirements) {
      return Math.max(1, i);
    }
  }
  return gamifiedCurriculum.length;
}

function getNextMilestone(currentLevel: number, stats: { wpm: number; accuracy: number }): string {
  if (currentLevel >= gamifiedCurriculum.length) {
    return "Crown of Keys achieved - You are the master!";
  }

  const nextLevel = gamifiedCurriculum[currentLevel];
  const wpmGap = Math.max(0, nextLevel.unlockRequirements.minimumWpm - stats.wpm);
  const accuracyGap = Math.max(0, nextLevel.unlockRequirements.minimumAccuracy - stats.accuracy);

  if (wpmGap > 0 && accuracyGap > 0) {
    return `Need ${wpmGap} more WPM and ${accuracyGap}% accuracy for ${nextLevel.title}`;
  } else if (wpmGap > 0) {
    return `Need ${wpmGap} more WPM for ${nextLevel.title}`;
  } else if (accuracyGap > 0) {
    return `Need ${accuracyGap}% more accuracy for ${nextLevel.title}`;
  } else {
    return `Ready to unlock ${nextLevel.title}!`;
  }
}

function estimateTimeToCompletion(completed: number, total: number): string {
  const remaining = total - completed;
  const averageLessonsPerWeek = 3; // Based on research for accessibility users
  const weeks = Math.ceil(remaining / averageLessonsPerWeek);

  if (weeks <= 4) return `${weeks} weeks`;
  if (weeks <= 16) return `${Math.ceil(weeks / 4)} months`;
  return `${Math.ceil(weeks / 12)} months`;
}