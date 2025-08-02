// Comprehensive Gamified One-Hand Typing Curriculum
// Based on research from SRA Lab, Duolingo gamification studies, and accessibility education best practices

export interface CurriculumLesson {
  id: string;
  title: string;
  description: string;
  gotTheme: {
    character: string;
    house: string;
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
  gotTheme: {
    kingdom: string;
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

// Game of Thrones-Themed Curriculum: 10 Comprehensive Levels
export const gamifiedCurriculum: CurriculumLevel[] = [
  {
    id: "level-1-north",
    title: "The Northern Basics: House Stark's Foundation",
    description: "Begin your typing journey in the cold North, where honor and precision matter most. Learn the fundamental keys under the watchful eyes of the Starks.",
    gotTheme: {
      kingdom: "The North",
      storyline: "Begin your typing journey in the cold North, where honor and precision matter most. Learn the fundamental keys under the watchful eyes of the Starks.",
      characterArc: "Eddard Stark's leadership",
      majorQuest: "Learn the sacred home row position where your fingers rest, like the ancient Heart Tree in Winterfell's godswood."
    },
    lessons: [
      {
        id: "lesson-1-1",
        title: "Home Position: The Heart Tree",
        description: "Learn the sacred home row position where your fingers rest, like the ancient Heart Tree in Winterfell's godswood.",
        gotTheme: {
          character: "Eddard Stark",
          house: "Stark",
          location: "Winterfell Godswood",
          storyContext: "Place your hands on the keyboard as Ned places his hands on Ice before the Heart Tree",
          flavorText: "The North remembers, and so will you."
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
          achievements: ["Stark Sigil Badge"],
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
        title: "The Stark Words: Winter is Coming",
        description: "Type the words of House Stark and learn basic letter combinations that flow like the cold northern winds.",
        gotTheme: {
          character: "Jon Snow",
          house: "Stark",
          location: "The Wall",
          storyContext: "Practice typing with the precision and focus that Jon Snow brings to his vows and duties.",
          flavorText: "Know nothing, but type everything. Night's Watch"
        },
        skills: ["Letter combinations", "Word formation", "Rhythm"],
        targetWpm: 8,
        targetAccuracy: 85.00,
        content: "Basic words and House Stark references",
        practiceText: [
          "winter is coming",
          "stark wolf pack",
          "ned jon arya sansa",
          "honor duty family"
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
          achievements: ["Know Nothing Badge"],
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
        title: "Jon Snow's Bastard Letters",
        description: "Master the challenging letter combinations, proving yourself worthy despite your origins, like Jon Snow at the Wall.",
        gotTheme: {
          character: "Jon Snow",
          house: "Stark",
          location: "Castle Black",
          storyContext: "Rise above your station through dedication and practice, as Jon rose from bastard to Lord Commander",
          flavorText: "Winter is coming, and so is your typing mastery."
        },
        skills: ["Complex combinations", "Speed building", "Accuracy under pressure"],
        targetWpm: 12,
        targetAccuracy: 88.00,
        content: "Advanced letter patterns and combinations",
        practiceText: [
          "bastard black watch",
          "lord commander snow",
          "night gathers now begins",
          "sword in the darkness"
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
          achievements: ["Night's Watch Cloak"],
          unlocks: ["20 Honor Points", "Longclaw Sword"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "North Rewards",
      badge: "House Stark Banner",
      keyboardTheme: "stark_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Winterfell Castle Badge", "50 Honor Points"]
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
    id: "level-2-riverlands",
    title: "The Riverlands Flow: House Tully's Grace",
    description: "Flow like the rivers of the Trident, where House Tully rules with honor and grace. Master fluid typing movements.",
    gotTheme: {
      kingdom: "The Riverlands",
      storyline: "Master fluid typing movements like the flowing rivers of the Trident",
      characterArc: "Learn to adapt your typing style to flow smoothly between keys",
      majorQuest: "Complete all riverlands typing challenges with accuracy and speed"
    },
    lessons: [
      {
        id: "lesson-2-1",
        title: "Tully Tributaries: Common Words",
        description: "Let your fingers flow like the many tributaries of the Trident, mastering common English words with fluid grace.",
        gotTheme: {
          character: "Catelyn Stark",
          house: "Tully",
          location: "Riverrun",
          storyContext: "Type with the wisdom and flow of Lady Catelyn's counsel",
          flavorText: "Let your fingers flow like the many tributaries of the Trident"
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
          achievements: ["Lannister Gold Dragon"],
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
        title: "Edmure's Bridge Battle: Word Combinations",
        description: "Fight alongside Edmure Tully at Stone Mill, connecting words like a strategic bridge across the battlefield.",
        gotTheme: {
          character: "Edmure Tully",
          house: "Tully",
          location: "Stone Mill",
          storyContext: "Connect your words as Edmure connects the riverlands in defense",
          flavorText: "The bridge builder's precision in every keystroke."
        },
        skills: ["Word transitions", "Speed consistency", "Strategic typing"],
        targetWpm: 18,
        targetAccuracy: 88.00,
        content: "Multi-word combinations and phrases",
        practiceText: [
          "family duty honor flows",
          "riverrun stands strong together",
          "trident waters never surrender",
          "edmure tully bridge builder"
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
          achievements: ["Stone Bridge Badge", "Battle Commander Title"],
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
        title: "Blackfish's Tactical Precision",
        description: "Master tactical precision like Ser Brynden Tully, the Blackfish, combining speed with surgical accuracy.",
        gotTheme: {
          character: "Brynden Tully",
          house: "Tully",
          location: "Riverrun Castle",
          storyContext: "Strike with the precision of a master tactician who never yields",
          flavorText: "The Blackfish never yields, and neither should your typing precision."
        },
        skills: ["Tactical typing", "Precision under pressure", "Military efficiency"],
        targetWpm: 20,
        targetAccuracy: 92.00,
        content: "Military tactics and strategic commands",
        practiceText: [
          "tactical retreat riverrun defense",
          "blackfish never yields to tyranny",
          "family duty honor above all else",
          "the old knight stands his ground"
        ],
        keyFocus: ["tactical patterns", "military precision"],
        estimatedTime: 30,
        difficulty: 3,
        prerequisites: ["lesson-2-2"],
        unlockRequirements: {
          accuracy: 88
        },
        rewards: {
          xp: 40,
          coins: 30,
          achievements: ["Blackfish Badge"],
          unlocks: ["35 Honor Points", "Tactical Medal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Riverlands Rewards",
      badge: "House Tully Seal",
      keyboardTheme: "tully_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Riverlands Map", "90 Honor Points"]
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
    id: "level-3-reach",
    title: "The Reach Prosperity: House Tyrell's Garden",
    description: "Flourish like the golden roses of Highgarden, where House Tyrell cultivates both gardens and sentences with equal beauty.",
    gotTheme: {
      kingdom: "The Reach",
      storyline: "Flourish like the golden roses of Highgarden, where House Tyrell cultivates both gardens and sentences with equal beauty.",
      characterArc: "Develop typing skills with the grace and refinement of House Tyrell",
      majorQuest: "Master complex sentence structures and punctuation like the fertile gardens of the Reach"
    },
    lessons: [
      {
        id: "lesson-3-1",
        title: "Rose Garden Sentences",
        description: "Cultivate beautiful, complete sentences that bloom like roses in the gardens of Highgarden.",
        gotTheme: {
          character: "Margaery Tyrell",
          house: "House Tyrell",
          location: "Highgarden",
          storyContext: "Craft sentences as beautiful and strategic as Margaery's words at court",
          flavorText: "The golden roses of Highgarden require careful tending, just like these sentences require careful typing."
        },
        skills: ["Complete sentences", "Punctuation", "Capitalization"],
        targetWpm: 20,
        targetAccuracy: 92.00,
        content: "Full sentences with proper punctuation",
        practiceText: [
          "The golden roses bloom in Highgarden's fertile soil.",
          "Margaery Tyrell speaks with grace and hidden power.",
          "Growing strong through seasons of plenty and want.",
          "The Reach feeds the Seven Kingdoms with abundance."
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
          achievements: ["Golden Rose"],
          unlocks: ["40 Honor Points", "Highgarden Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-3-2",
        title: "Olenna's Sharp Wit: Complex Phrases",
        description: "Master complex sentences with the sharp wit of the Queen of Thorns, weaving words like political schemes.",
        gotTheme: {
          character: "Olenna Tyrell",
          house: "House Tyrell",
          location: "Highgarden Gardens",
          storyContext: "Every word carries thorns beneath the beauty, like Olenna's cutting remarks",
          flavorText: "The Queen of Thorns sharp wit cuts through simple sentences, demanding precision in every keystroke."
        },
        skills: ["Complex sentences", "Advanced punctuation", "Literary flow"],
        targetWpm: 22,
        targetAccuracy: 90.00,
        content: "Complex sentences with multiple clauses",
        practiceText: [
          "\"I want her to know it was me,\" said the Queen of Thorns with satisfaction.",
          "The roses have thorns, and the Tyrells have schemes within schemes.",
          "Growing strong means adapting, surviving, and eventually thriving.",
          "What good is power if you cannot protect those you love most?"
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
          achievements: ["Queen of Thorns Crown"],
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
        title: "Loras the Knight of Flowers",
        description: "Display the grace and skill of Ser Loras Tyrell, the Knight of Flowers, in elegant and flowing text mastery.",
        gotTheme: {
          character: "Loras Tyrell",
          house: "House Tyrell",
          location: "Tournament Grounds",
          storyContext: "Move with the grace of a tournament champion, every keystroke a perfect joust",
          flavorText: "The Knight of Flowers demonstrates perfect form in every tournament, just as we strive for perfect keystrokes in every lesson."
        },
        skills: ["Elegant flow", "Tournament speed", "Graceful accuracy"],
        targetWpm: 25,
        targetAccuracy: 94.00,
        content: "Tournament descriptions and knightly valor",
        practiceText: [
          "The Knight of Flowers rides with unmatched grace and skill.",
          "In tournament and battle, elegance meets deadly precision.",
          "A rose by any other name would smell as sweet.",
          "True knighthood combines strength with beauty and honor."
        ],
        keyFocus: ["elegant patterns", "flowing combinations", "tournament rhythm"],
        estimatedTime: 25,
        difficulty: 4,
        prerequisites: ["lesson-3-2"],
        unlockRequirements: {
          accuracy: 90
        },
        rewards: {
          xp: 55,
          coins: 40,
          achievements: ["Knight of Flowers Lance"],
          unlocks: ["45 Honor Points", "Tournament Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "Westerlands Rewards",
      badge: "House Lannister Gold Seal",
      keyboardTheme: "lannister_theme",
      layoutUnlock: "qwerty",
      specialFeatures: ["Casterly Rock Map", "135 Honor Points"]
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
    id: "level-4-westerlands",
    title: "The Westerlands Wealth: House Lannister's Gold",
    description: "Type with the precision of Lannister gold counting, mastering numbers, symbols, and the wealth of characters.",
    gotTheme: {
      kingdom: "The Westerlands",
      storyline: "Gold and Power",
      characterArc: "Tyrion's Growth and Cersei's Ambition",
      majorQuest: "Master the Lannister wealth calculations"
    },
    lessons: [
      {
        id: "lesson-4-1",
        title: "Lannister Ledgers: Numbers and Symbols",
        description: "Count gold and debts with Tyrion's precision, mastering the number row and special characters that make up the wealth of the realm.",
        gotTheme: {
          character: "Tyrion Lannister",
          house: "Lannister",
          location: "Casterly Rock",
          storyContext: "A Lannister always pays his debts, and every debt must be precisely recorded",
          flavorText: "The Iron Bank will have its due."
        },
        skills: ["Number row mastery", "Special characters", "Financial notation"],
        targetWpm: 18,
        targetAccuracy: 88.00,
        content: "Numbers, symbols, and financial calculations",
        practiceText: [
          "The Iron Bank: 1,000,000 gold dragons @ 3% interest",
          "Casterly Rock mines: $500,000 per year (est. 2024)",
          "Debt to Crown: 3,500,000 gold pieces + 12% penalty",
          "A Lannister always pays: 100% of debts, 0% tolerance for default"
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
          achievements: ["Golden Lion"],
          unlocks: ["45 Honor Points", "Casterly Rock Seal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-4-2",
        title: "Cersei's Schemes: Special Characters",
        description: "Navigate the complex web of special characters like Cersei navigates the deadly game of thrones.",
        gotTheme: {
          character: "Cersei Lannister",
          house: "Lannister",
          location: "Red Keep",
          storyContext: "Every symbol holds power, like every word in Cersei's schemes",
          flavorText: "Power is power, and I have it all."
        },
        skills: ["Advanced symbols", "Keyboard mastery", "Complex notation"],
        targetWpm: 20,
        targetAccuracy: 85.00,
        content: "Programming symbols and advanced punctuation",
        practiceText: [
          "if (power >= throne) { cersei.claim(); } else { cersei.scheme++; }",
          "The Queen's motto: \"Power = Control && Control != Love\"",
          "Royal decree #47: taxes += 25%; peasant.happiness--;",
          "Wildfire formula: 3{CH₂[NO₃]₂} + 2{Al} → explosive.power++;"
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
          achievements: ["Queen's Crown"],
          unlocks: ["55 Honor Points", "Wildfire Vial"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-4-3",
        title: "Jaime's Redemption: Honor Through Difficulty",
        description: "Find redemption through challenge like Jaime Lannister, proving worth through difficult symbol combinations and complex typing.",
        gotTheme: {
          character: "Jaime Lannister",
          house: "Lannister",
          location: "Riverlands",
          storyContext: "Redemption comes through facing the hardest challenges with honor",
          flavorText: "There are no men like me. Only me."
        },
        skills: ["Redemptive accuracy", "Complex symbol mastery", "Honor under pressure"],
        targetWpm: 23,
        targetAccuracy: 90.00,
        content: "Complex programming and mathematical notation",
        practiceText: [
          "function knightlyHonor() { return (actions.filter(deed => deed.isHonorable)).length; }",
          "The golden hand: Math.pow(skill, 2) + redemption * effort = true_worth",
          "Brienne taught me: honor !== birth_right && courage > reputation",
          "A knight's true test: (loyalty && courage && honor) || redemption.earned"
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
          achievements: ["Redemption Sword"],
          unlocks: ["60 Honor Points", "Golden Hand"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "House Lannister Golden Crown",
      badge: "Casterly Rock Gold",
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
    id: "level-5-stormlands",
    title: "The Stormlands Fury: House Baratheon's Power",
    description: "Channel the fury of storms and the strength of stags, typing with the raw power and speed of House Baratheon.",
    gotTheme: {
      kingdom: "The Stormlands",
      storyline: "Channel the fury of storms and the strength of stags, typing with the raw power and speed of House Baratheon.",
      characterArc: "Develop powerful typing techniques with the strength of House Baratheon",
      majorQuest: "Master high-speed typing challenges like the storms of the Stormlands"
    },
    lessons: [
      {
        id: "lesson-5-1",
        title: "Baratheon Battle Commands",
        description: "Type with the commanding fury of Robert Baratheon in battle, focusing on speed and decisive action.",
        gotTheme: {
          character: "Robert Baratheon",
          house: "House Baratheon",
          location: "Storm's End",
          storyContext: "Strike fast and hard like Robert's warhammer in the heat of battle",
          flavorText: "Like Robert's fury in battle, we demand decisive action and commanding speed in every keystroke."
        },
        skills: ["Speed bursts", "Command typing", "Battle rhythm"],
        targetWpm: 25,
        targetAccuracy: 87.00,
        content: "Military commands and battle scenarios",
        practiceText: [
          "CHARGE! Forward the van! Break their lines!",
          "Sound the horns! Rally to the stag banner!",
          "Hold the line! Stand fast! Ours is the fury!",
          "Victory or death! For Storm's End! For the realm!"
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
          achievements: ["War Hammer", "Storm Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-5-2",
        title: "Stannis the Mannis: Precision Under Pressure",
        description: "Achieve perfect accuracy under time pressure, embodying Stannis's unwavering commitment to duty and justice.",
        gotTheme: {
          character: "Stannis Baratheon",
          house: "House Baratheon",
          location: "Dragonstone",
          storyContext: "Bend the knee or be destroyed - there is no middle ground in duty",
          flavorText: "Like Stannis's unwavering commitment to duty and justice, we demand perfect accuracy under time pressure."
        },
        skills: ["Accuracy under pressure", "Timed challenges", "Unwavering focus"],
        targetWpm: 30,
        targetAccuracy: 95.00,
        content: "Legal documents and precise declarations",
        practiceText: [
          "By right of birth and blood, I am the rightful heir to the Iron Throne.",
          "Justice must be served, regardless of personal cost or consequence.",
          "The law is the law. A good act does not wash out the bad.",
          "I will not become a page in someone else's history book."
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
          achievements: ["Crown of Justice"],
          unlocks: ["Lightbringer Sword"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-5-3",
        title: "Renly's Charisma: Speed with Style",
        description: "Combine speed with charismatic flair like Renly Baratheon, proving that style and substance can triumph together.",
        gotTheme: {
          character: "Renly Baratheon",
          house: "House Baratheon",
          location: "Storm's End Gardens",
          storyContext: "Win hearts and minds with charismatic speed and undeniable style",
          flavorText: "A true king inspires his people through both words and actions."
        },
        skills: ["Charismatic speed", "Style with substance", "Inspirational typing"],
        targetWpm: 32,
        targetAccuracy: 89.00,
        content: "Inspirational speeches and charismatic declarations",
        practiceText: [
          "A king should be strong, brave, and loved by his people.",
          "Why should a crown be a burden when it could be a joy?",
          "The realm needs a king who inspires hope, not fear.",
          "Together we can build a kingdom of prosperity and peace."
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
          unlocks: ["Rainbow Guard Cloak", "55 Honor Points"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "House Baratheon Antler Crown",
      badge: "Storm's End Banner",
      specialFeatures: ["170 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-4-hills-of-the-vale",
      minimumWpm: 20,
      minimumAccuracy: 85,
      completionPercentage: 100
    },
    estimatedCompletionTime: "80 minutes",
    accessibilityFocus: ["Speed indicators", "Pressure management", "Focus tools"]
  },
  {
    id: "level-6-vale",
    title: "The Vale Heights: House Arryn's Honor",
    description: "Reach new heights of typing excellence in the impregnable Eyrie, where honor and precision soar as high as eagles.",
    gotTheme: {
      kingdom: "The Vale",
      storyline: "Reach new heights of typing excellence in the impregnable Eyrie, where honor and precision soar as high as eagles.",
      characterArc: "Master advanced typing techniques with the noble honor of House Arryn",
      majorQuest: "Achieve perfect typing accuracy through honor and dedication"
    },
    lessons: [
      {
        id: "lesson-6-1",
        title: "Arryn Honor Code",
        description: "Master advanced typing techniques with the noble honor of House Arryn, achieving new heights of speed and accuracy.",
        gotTheme: {
          character: "Jon Arryn",
          house: "House Arryn",
          location: "The Eyrie",
          storyContext: "Rise as high as honor itself, touching the clouds with your excellence",
          flavorText: "Like the noble honor of House Arryn, we demand advanced typing techniques that achieve new heights of speed and accuracy."
        },
        skills: ["Advanced techniques", "Honor-bound accuracy", "Noble speed"],
        targetWpm: 35,
        targetAccuracy: 93.00,
        content: "Advanced passages about honor and nobility",
        practiceText: [
          "Honor is not a luxury that can be discarded when convenient.",
          "The Eyrie stands unconquered because some heights cannot be reached by force.",
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
          achievements: ["Eagle Feather"],
          unlocks: ["Sky Cell Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-6-2",
        title: "Lysa's Maternal Protection: Defensive Typing",
        description: "Master defensive typing techniques with the fierce protection of Lysa Arryn, guarding every keystroke like a mother protects her child.",
        gotTheme: {
          character: "Lysa Arryn",
          house: "House Arryn",
          location: "Eyrie Throne Room",
          storyContext: "Protect your accuracy as fiercely as Lysa protects her son",
          flavorText: "Like Lysa's fierce protection of her child, we demand defensive typing techniques that guard every keystroke."
        },
        skills: ["Defensive accuracy", "Protective precision", "Maternal consistency"],
        targetWpm: 28,
        targetAccuracy: 96.00,
        content: "Protective declarations and maternal wisdom",
        practiceText: [
          "A mother's love knows no bounds, no limits, no compromise.",
          "The moon door awaits those who threaten what we hold dear.",
          "In the highest castle, the most precious things are kept safe.",
          "Protection sometimes requires extreme measures and unwavering resolve."
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
          achievements: ["Protective Mother Badge"],
          unlocks: ["Moon Door Key"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-6-3",
        title: "Robin's Flight: Learning to Soar",
        description: "Learn to soar with confidence like young Robin Arryn finding his wings, mastering advanced flight patterns in typing.",
        gotTheme: {
          character: "Robin Arryn",
          house: "House Arryn",
          location: "Eyrie Training Grounds",
          storyContext: "Find your wings and soar above the clouds with newfound confidence",
          flavorText: "Like young Robin Arryn finding his wings, we'll master advanced flight patterns in typing with confidence."
        },
        skills: ["Soaring speed", "Confident flight", "Advanced patterns"],
        targetWpm: 38,
        targetAccuracy: 91.00,
        content: "Flight metaphors and soaring achievements",
        practiceText: [
          "The young eagle learns to spread his wings and trust the wind.",
          "Every flight begins with a leap of faith from the nest.",
          "Soaring high requires courage to leave the safety of the ground.",
          "The Vale teaches that the highest peaks offer the clearest view."
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
          achievements: ["Eagle Wings"],
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
      title: "House Arryn Eagle Banner",
      badge: "Eyrie Seal",
      specialFeatures: ["170 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-5-stormlands",
      minimumWpm: 25,
      minimumAccuracy: 87,
      completionPercentage: 100
    },
    estimatedCompletionTime: "105 minutes",
    accessibilityFocus: ["Height metaphors", "Honor visualization", "Eagle-eye precision"]
  },
  {
    id: "level-7-dorne",
    title: "Dorne's Patience: House Martell's Endurance",
    description: "Develop the patient endurance of the Dornish, typing long passages with the steady persistence of the desert sun.",
    gotTheme: {
      kingdom: "Dorne",
      storyline: "Develop the patient endurance of the Dornish, typing long passages with the steady persistence of the desert sun.",
      characterArc: "Build typing endurance like the unconquered Dornish people",
      majorQuest: "Master extended typing sessions with sustained accuracy"
    },
    lessons: [
      {
        id: "lesson-7-1",
        title: "Martell Patience: Extended Passages",
        description: "Build endurance like the unconquered Dornish, maintaining speed and accuracy through extended typing sessions.",
        gotTheme: {
          character: "Tyrion Lannister",
          house: "Lannister",
          location: "King's Landing",
          storyContext: "Type with the wit and precision that Tyrion Lannister brings to his clever remarks and strategic thinking.",
          flavorText: "A Lannister always pays his debts... and types with perfect accuracy."
        },
        skills: ["Endurance typing", "Sustained accuracy", "Desert patience"],
        targetWpm: 32,
        targetAccuracy: 91.00,
        content: "Extended passages about Dorne and endurance",
        practiceText: [
          "The Red Viper was patient when he needed to be, striking only when the moment was perfect. Dorne had survived conquest through patience, persistence, and the burning desire for justice that never dies in the desert heat.",
          "Unbowed, unbent, unbroken - these words echo through the red mountains and across the vast deserts of Dorne. No foreign army has ever conquered this land, not through superior force, but through the unbreakable will of its people.",
          "Prince Oberyn Martell moved like water in the desert - fluid, adaptive, conserving energy for the moment when explosive action was required. Every movement was calculated, every word chosen with care.",
          "The desert teaches patience to those who would survive. The sun rises and sets, the sands shift but never break, and the people of Dorne endure as they always have - proud, free, and unconquerable."
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
          achievements: ["Red Viper Spear"],
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
        title: "Arianne's Ambition: Strategic Complexity",
        description: "Master complex strategic thinking like Princess Arianne Martell, weaving intricate plots through advanced typing patterns.",
        gotTheme: {
          character: "Arianne Martell",
          house: "House Martell",
          location: "Water Gardens",
          storyContext: "Every move is part of a larger game, every keystroke part of a grander strategy",
          flavorText: "Like Princess Arianne's intricate plots, we'll weave complex strategies through advanced typing patterns."
        },
        skills: ["Strategic complexity", "Advanced planning", "Intricate patterns"],
        targetWpm: 30,
        targetAccuracy: 94.00,
        content: "Strategic planning and complex political maneuvering",
        practiceText: [
          "The game of thrones is played in Dorne with different rules than the rest of Westeros.",
          "Princess Arianne weaves plans within plans, each move calculated for maximum advantage.",
          "In the Water Gardens, children learn that strategy begins with understanding your opponent.",
          "Dorne's strength lies not in armies, but in the cunning minds of its noble leaders."
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
          achievements: ["Princess Crown"],
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
        title: "Sand Snakes Strike: Coordinated Precision",
        description: "Strike with the coordinated precision of the Sand Snakes, mastering multiple typing patterns in perfect harmony.",
        gotTheme: {
          character: "The Sand Snakes",
          house: "House Martell",
          location: "Dornish Desert",
          storyContext: "Eight daughters, each deadly in her own way, moving as one unstoppable force",
          flavorText: "Like the Sand Snakes in perfect harmony, we'll master multiple typing patterns with coordinated precision."
        },
        skills: ["Coordinated strikes", "Multi-pattern mastery", "Sisterly precision"],
        targetWpm: 35,
        targetAccuracy: 92.00,
        content: "Coordinated attacks and sisterly cooperation",
        practiceText: [
          "Obara with her spear, Nymeria with her whip, Tyene with her daggers hidden in silk.",
          "The Sand Snakes move as one, each complementing the others' deadly skills.",
          "Vengeance for our father burns in our hearts like the Dornish sun.",
          "We are daughters of Oberyn Martell, and we do not forget, we do not forgive."
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
          achievements: ["Sand Snake Weapons"],
          unlocks: ["Sisterhood Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "House Martell Sun Spear",
      badge: "Dornish Expertise",
      specialFeatures: ["185 XP", "75 Coins", "Dorne Independence Scroll"]
    },
    unlockRequirements: {
      previousLevel: "level-6-vale",
      minimumWpm: 28,
      minimumAccuracy: 89,
      completionPercentage: 100
    },
    estimatedCompletionTime: "115 minutes",
    accessibilityFocus: ["Endurance pacing", "Break reminders", "Stamina indicators"]
  },
  {
    id: "level-8-iron-islands",
    title: "The Iron Islands Steel: House Greyjoy's Strength",
    description: "Pay the iron price for mastery, typing with the relentless determination of the Ironborn who take what is theirs by strength.",
    gotTheme: {
      kingdom: "Iron Islands",
      storyline: "The Iron Way",
      characterArc: "Ironborn Resilience",
      majorQuest: "Paying the Iron Price"
    },
    lessons: [
      {
        id: "lesson-8-1",
        title: "Greyjoy Reaving: Technical Typing",
        description: "Master technical content with the fierce determination of Ironborn reavers, taking what is yours by right of skill.",
        gotTheme: {
          character: "Theon Greyjoy",
          house: "House Greyjoy",
          location: "Pyke",
          storyContext: "What is dead may never die, but rises again harder and stronger",
          flavorText: "Like Ironborn reavers, we'll take what is ours by right of skill through mastering technical content."
        },
        skills: ["Technical typing", "Code patterns", "Complex formatting"],
        targetWpm: 28,
        targetAccuracy: 89.00,
        content: "Programming code and technical documentation",
        practiceText: [
          "function payIronPrice(skill) { return skill > goldPrice ? victory : defeat; }",
          "const drownedGod = { motto: 'What is dead may never die', strength: Infinity };",
          "class Ironborn extends Warrior { constructor() { super(); this.motto = 'We do not sow'; } }",
          "// The Ironborn way: Take what you can by strength, keep what you can by skill"
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
          achievements: ["Kraken Tentacle"],
          unlocks: ["Iron Crown"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-8-2",
        title: "Euron's Dark Magic: Advanced Symbols",
        description: "Channel the dark sorcery of Euron Crow's Eye, mastering the most complex and esoteric symbol combinations.",
        gotTheme: {
          character: "Euron Greyjoy",
          house: "House Greyjoy",
          location: "Silence Ship",
          storyContext: "I am the storm, and the first storm and the last",
          flavorText: "Like Euron Crow's Eye, we'll master the most complex and esoteric symbol combinations through dark sorcery."
        },
        skills: ["Dark symbol mastery", "Esoteric patterns", "Storm-like intensity"],
        targetWpm: 26,
        targetAccuracy: 87.00,
        content: "Complex magical and technical formulations",
        practiceText: [
          "const stormCrow = { power: Infinity, sanity: null, fear: () => 'chaos' };",
          "function dragonBinding(horn) { return horn.blast() && reality.warp(); }",
          "if (crow.eye.sees(future)) { timeline.alter(desire); } else { world.burn(); }",
          "The Crow's Eye: ∞ > ∑(kings) && madness ∝ power^∞"
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
          achievements: ["Dragonfire Resistance", "King's Hand Seal"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-8-3",
        title: "Asha's Leadership: Command and Control",
        description: "Lead with the fierce competence of Asha Greyjoy, mastering command syntax and leadership through typed orders.",
        gotTheme: {
          character: "Asha Greyjoy",
          house: "House Greyjoy",
          location: "Ironborn Fleet",
          storyContext: "A true leader commands respect through skill, not fear",
          flavorText: "Like Asha Greyjoy's fierce competence, we'll master command syntax and leadership through typed orders."
        },
        skills: ["Command typing", "Leadership patterns", "Fleet coordination"],
        targetWpm: 33,
        targetAccuracy: 91.00,
        content: "Naval commands and leadership directives",
        practiceText: [
          "All hands on deck! Prepare for battle! Show them the iron price!",
          "Navigate by the stars, fight by the tide, win by superior seamanship.",
          "The Iron Fleet sails under my command - follow or be left behind.",
          "Asha Greyjoy leads from the front, never asking what she won't do herself."
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
      title: "House Greyjoy Seastone Chair",
      badge: "Iron Islands Fleet",
      specialFeatures: ["210 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-7-dorne",
      minimumWpm: 25,
      minimumAccuracy: 85,
      completionPercentage: 100
    },
    estimatedCompletionTime: "105 minutes",
    accessibilityFocus: ["Code structure", "Technical precision", "Symbol mastery"]
  },
  {
    id: "level-9-beyond-wall",
    title: "Beyond the Wall: Night's Watch Vigilance",
    description: "Stand guard against the darkness with the Night's Watch, maintaining perfect vigilance and accuracy when stakes are highest.",
    gotTheme: {
      kingdom: "Beyond the Wall",
      storyline: "Guarding the Realms of Men",
      characterArc: "From Recruit to Ranger",
      majorQuest: "Defend Against the Long Night"
    },
    lessons: [
      {
        id: "lesson-9-1",
        title: "Night's Watch Oath: The Final Vigil",
        description: "Recite the sacred oath with perfect accuracy, for the Watch must never waver in the face of ultimate darkness.",
        gotTheme: {
          character: "Arya Stark",
          house: "Stark",
          location: "Winterfell",
          storyContext: "Master the letters and words that Arya Stark would use in her training as a skilled warrior.",
          flavorText: "A girl has no name, but she has swift fingers."
        },
        skills: ["Perfect accuracy", "Ceremonial precision", "Ultimate challenge"],
        targetWpm: 40,
        targetAccuracy: 98.00,
        content: "The complete Night's Watch oath and advanced challenges",
        practiceText: [
          "Night gathers, and now my watch begins. It shall not end until my death. I shall take no wife, hold no lands, father no children. I shall wear no crowns and win no glory. I shall live and die at my post. I am the sword in the darkness. I am the watcher on the walls. I am the fire that burns against the cold, the light that brings the dawn, the horn that wakes the sleepers, the shield that guards the realms of men. I pledge my life and honor to the Night's Watch, for this night and all the nights to come."
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
          achievements: ["Black Brother Cloak"],
          unlocks: ["Valyrian Steel Sword"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-9-2",
        title: "White Walker Threat: Crisis Typing",
        description: "Type with desperate precision as the White Walker threat approaches, where every keystroke could mean survival or doom.",
        gotTheme: {
          character: "Samwell Tarly",
          house: "House Tarly",
          location: "Eastwatch by the Sea",
          storyContext: "Knowledge and speed are your only weapons against the endless night",
          flavorText: "Like Samwell's desperate precision, we'll type with urgency as the White Walker threat approaches."
        },
        skills: ["Crisis management", "Emergency speed", "Life-or-death accuracy"],
        targetWpm: 45,
        targetAccuracy: 96.00,
        content: "Emergency messages and crisis communications",
        practiceText: [
          "URGENT: White Walker army approaching! All ravens to King's Landing immediately!",
          "The dead march south! Warn the Seven Kingdoms! The Long Night has begun!",
          "Dragonglass weapons required! Rally all forces! The living must unite or perish!",
          "Send word to Daenerys Targaryen: The war for the dawn has come at last!"
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
          achievements: ["Dragonglass Dagger"],
          unlocks: ["White Walker Vision"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      },
      {
        id: "lesson-9-3",
        title: "The Long Night's End: Victory Through Unity",
        description: "Type the final victory message as the Long Night ends, proving that unity and skill can overcome any darkness.",
        gotTheme: {
          character: "All Heroes United",
          house: "All Great Houses",
          location: "Winterfell",
          storyContext: "The dawn breaks, the darkness retreats, and typing mastery has saved the realm",
          flavorText: "Like the united heroes of Westeros, we'll type the final victory message as the Long Night ends."
        },
        skills: ["Victory typing", "Unified mastery", "Dawn breaking speed"],
        targetWpm: 42,
        targetAccuracy: 97.00,
        content: "Victory proclamations and the dawn of a new era",
        practiceText: [
          "The Long Night is ended! The dead are defeated! The dawn has come at last!",
          "Through unity of purpose and mastery of skill, the living have prevailed.",
          "Let it be known that courage, sacrifice, and perfect precision saved the realm.",
          "The Watch continues, but now they guard a world reborn in victory and hope."
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
          achievements: ["Beyond the Wall Survival", "The True North Badge"]
        },
        adaptiveFeatures: {
          fatiguePrevention: true,
          difficultyScaling: true,
          customPacing: true
        }
      }
    ],
    levelRewards: {
      title: "The Wall Defender Title",
      badge: "Night's Watch Lord Commander Cloak",
      specialFeatures: ["270 Honor Points"]
    },
    unlockRequirements: {
      previousLevel: "level-8-iron-islands",
      minimumWpm: 35,
      minimumAccuracy: 95,
      completionPercentage: 100
    },
    estimatedCompletionTime: "115 minutes",
    accessibilityFocus: ["Sacred text support", "Oath memorization", "Perfect accuracy tools"]
  },
  {
    id: "level-10-iron-throne",
    title: "The Iron Throne: King of Typing",
    description: "Claim the ultimate prize and sit upon the Iron Throne of typing mastery, ruling over all keys with absolute dominion.",
    gotTheme: {
      kingdom: "The Seven Kingdoms",
      storyline: "Game of Keys",
      characterArc: "From Novice to King",
      majorQuest: "Claim the Iron Throne"
    },
    lessons: [
      {
        id: "lesson-10-1",
        title: "Royal Proclamations: Master's Challenge",
        description: "Issue royal proclamations with the authority and precision befitting the true ruler of the Seven Kingdoms of Typing.",
        gotTheme: {
          character: "The True King/Queen",
          house: "The Iron Throne",
          location: "Iron Throne Room",
          storyContext: "You have mastered all keys, united all houses, and earned the right to rule",
          flavorText: "Like the true ruler of the Seven Kingdoms, we'll issue royal proclamations with authority and precision."
        },
        skills: ["Absolute mastery", "Royal precision", "Supreme speed"],
        targetWpm: 50,
        targetAccuracy: 99.00,
        content: "Royal proclamations and the ultimate typing challenge",
        practiceText: [
          "By royal decree of the Sovereign of All Keys, let it be known throughout the Seven Kingdoms of Typing that this bearer has achieved complete mastery over the sacred art of the keyboard. They have proven themselves in battle against the letters, emerged victorious over the numbers, conquered the symbols, and bent the very punctuation marks to their will. From the frozen wastes Beyond the Wall to the burning sands of Dorne, from the iron mines of Casterly Rock to the rose gardens of Highgarden, let all acknowledge this supreme achievement. Long may they type, swift may their fingers fly, and true may their accuracy remain. For theirs is the keyboard, the speed, and the precision, now and forever."
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
          achievements: ["Iron Throne Mastery"],
          unlocks: ["Royal Decree"]
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
        description: "Achieve eternal legacy status, becoming a legend whose typing mastery will be remembered for all time.",
        gotTheme: {
          character: "The Eternal Grandmaster",
          house: "The Iron Throne",
          location: "Hall of Legends",
          storyContext: "Your name shall be carved in the annals of typing history forever",
          flavorText: "Like a legend whose typing mastery will be remembered for all time, we'll achieve eternal legacy status."
        },
        skills: ["Legendary mastery", "Eternal precision", "Transcendent speed"],
        targetWpm: 55,
        targetAccuracy: 99.50,
        content: "The ultimate challenge for typing immortality",
        practiceText: [
          "In the great library of legends, where the names of typing masters echo through eternity, your achievement shall stand as a beacon of what human potential can accomplish. You have transcended mere skill to achieve artistry, moved beyond technique to touch the realm of magic. Every keystroke is a brushstroke on the canvas of excellence, every word a note in the symphony of mastery. Future generations will study your precision, marvel at your speed, and aspire to your legendary status. You are no longer merely a typist - you are an artist, a master, a legend whose fingers dance across keys like a composer creating music for the ages."
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
      title: "King/Queen of Typing Title",
      badge: "The Iron Throne Itself",
      keyboardTheme: "Legendary Theme",
      specialFeatures: ["700 Honor Points", "Legendary Status"]
    },
    unlockRequirements: {
      previousLevel: "level-9-beyond-wall",
      minimumWpm: 50,
      minimumAccuracy: 98,
      completionPercentage: 100
    },
    estimatedCompletionTime: "210 minutes",
    accessibilityFocus: ["Royal treatment", "Throne room atmosphere", "Crown jewel precision"]
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
    title: string;
    description: string;
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
    return "Iron Throne achieved - You are the master!";
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