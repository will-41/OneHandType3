export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: "basics" | "words" | "sentences" | "advanced" | "curriculum";
  level: number;
  difficulty: number; // 1-5 scale
  content: string;
  text?: string; // Alias for content for backward compatibility
  targetWpm: number;
  timeLimit?: number; // in seconds
  handCompatibility: ("left" | "right")[];
  focusKeys?: string[]; // Keys this lesson focuses on
  prerequisites?: string[]; // Required lesson IDs
  wordCount?: number; // For UI display
  estimatedMinutes?: number; // For UI display
  estimatedTime?: number; // Alternative name for estimatedMinutes used in some components
}

// Static lessons data - kept for fallback, but API data should be used when available
export const staticLessons: Lesson[] = [
  // BASICS CATEGORY - Single finger training for beginners
  {
    id: "basics-1",
    title: "Index Finger - F",
    description: "Train your index finger with the F key",
    category: "basics",
    level: 1,
    difficulty: 1,
    content: "f f f f f f f f f f f f f f f f f f f f",
    text: "f f f f f f f f f f f f f f f f f f f f",
    targetWpm: 5,
    handCompatibility: ["left", "right"],
    focusKeys: ["f"],
    wordCount: 20,
    estimatedMinutes: 2,
  },
  {
    id: "basics-2", 
    title: "Index Finger - J",
    description: "Train your index finger with the J key",
    category: "basics",
    level: 2,
    difficulty: 1,
    content: "j j j j j",
    text: "j j j j j",
    targetWpm: 5,
    handCompatibility: ["left", "right"],
    focusKeys: ["j"],
    prerequisites: ["basics-1"],
    wordCount: 5,
    estimatedMinutes: 1,
  },
  {
    id: "basics-3",
    title: "Index Finger Combo",
    description: "Combine F and J keys",
    category: "basics",
    level: 3,
    difficulty: 1,
    content: "f j f j f j",
    text: "f j f j f j",
    targetWpm: 8,
    handCompatibility: ["left", "right"],
    focusKeys: ["f", "j"],
    prerequisites: ["basics-2"],
    wordCount: 6,
    estimatedMinutes: 1,
  },
  {
    id: "basics-4",
    title: "Middle Finger - D",
    description: "Train your middle finger with the D key",
    category: "basics", 
    level: 4,
    difficulty: 1,
    content: "d d d d d",
    text: "d d d d d",
    targetWpm: 5,
    handCompatibility: ["left", "right"],
    focusKeys: ["d"],
    prerequisites: ["basics-3"],
    wordCount: 5,
    estimatedMinutes: 1,
  },
  {
    id: "basics-5",
    title: "Middle Finger - K",
    description: "Train your middle finger with the K key",
    category: "basics", 
    level: 5,
    difficulty: 1,
    content: "k k k k k",
    text: "k k k k k",
    targetWpm: 5,
    handCompatibility: ["left", "right"],
    focusKeys: ["k"],
    prerequisites: ["basics-4"],
    wordCount: 5,
    estimatedMinutes: 1,
  },
  {
    id: "basics-6",
    title: "Two-Key Combo",
    description: "Combine different fingers: D and K",
    category: "basics",
    level: 6,
    difficulty: 2,
    content: "d k d k d k",
    text: "d k d k d k",
    targetWpm: 8,
    handCompatibility: ["left", "right"],
    focusKeys: ["d", "k"],
    prerequisites: ["basics-5"],
    wordCount: 6,
    estimatedMinutes: 1,
  },

  // WORDS CATEGORY - Common vocabulary practice
  {
    id: "words-1",
    title: "Common Words",
    description: "Practice the most frequently used English words",
    category: "words",
    level: 1,
    difficulty: 2,
    content: "the and for are but not you all can had her was one our out day get use man new now old see him two way who boy did its let put say she try",
    targetWpm: 25,
    handCompatibility: ["left", "right"],
    prerequisites: ["basics-3"],
  },
  {
    id: "words-2",
    title: "Short Words",
    description: "Quick 3-5 letter words for speed building",
    category: "words", 
    level: 2,
    difficulty: 2,
    content: "cat dog run jump fast slow good bad big small hot cold red blue green black white yes no top down left right here there when where what how why",
    targetWpm: 28,
    handCompatibility: ["left", "right"],
    prerequisites: ["words-1"],
  },
  {
    id: "words-3",
    title: "Medium Words",
    description: "6-8 letter words with varied patterns",
    category: "words",
    level: 3,
    difficulty: 3,
    content: "typing practice keyboard computer screen monitor display window button click scroll delete insert update create modify change improve develop",
    targetWpm: 30,
    handCompatibility: ["left", "right"], 
    prerequisites: ["words-2"],
  },
  {
    id: "words-4",
    title: "Technical Terms",
    description: "Technology and computer-related vocabulary",
    category: "words",
    level: 4,
    difficulty: 4,
    content: "algorithm database interface programming software hardware network internet browser application programming accessibility responsive design user experience",
    targetWpm: 32,
    handCompatibility: ["left", "right"],
    prerequisites: ["words-3"],
  },
  {
    id: "words-5", 
    title: "Advanced Vocabulary",
    description: "Complex words and professional terminology",
    category: "words",
    level: 5,
    difficulty: 4,
    content: "implementation optimization performance architecture infrastructure scalability maintainability accessibility compatibility interoperability functionality reliability",
    targetWpm: 35,
    handCompatibility: ["left", "right"],
    prerequisites: ["words-4"],
  },

  // SENTENCES CATEGORY - Full sentence practice
  {
    id: "sentences-1",
    title: "Simple Sentences",
    description: "Basic sentence structures with common words",
    category: "sentences",
    level: 1,
    difficulty: 2,
    content: "The cat sat on the mat. Dogs run in the park. I like to eat pizza. She reads books every day. We go to school together.",
    targetWpm: 28,
    handCompatibility: ["left", "right"],
    prerequisites: ["words-2"],
  },
  {
    id: "sentences-2",
    title: "Descriptive Sentences", 
    description: "Sentences with adjectives and details",
    category: "sentences",
    level: 2,
    difficulty: 3,
    content: "The quick brown fox jumps over the lazy dog. Beautiful flowers bloom in the spring garden. Modern computers process information very quickly.",
    targetWpm: 30,
    handCompatibility: ["left", "right"],
    prerequisites: ["sentences-1"],
  },
  {
    id: "sentences-3",
    title: "Complex Sentences",
    description: "Longer sentences with multiple clauses", 
    category: "sentences",
    level: 3,
    difficulty: 3,
    content: "When you practice typing regularly, your speed and accuracy will improve significantly. The accessibility features in modern applications help users with disabilities navigate and use software effectively.",
    targetWpm: 32,
    handCompatibility: ["left", "right"],
    prerequisites: ["sentences-2"],
  },
  {
    id: "sentences-4",
    title: "Technical Writing",
    description: "Professional and technical sentence structures",
    category: "sentences",
    level: 4,
    difficulty: 4,
    content: "The implementation of accessibility features requires careful consideration of user experience design principles. Responsive web design ensures that applications work seamlessly across different devices and screen sizes.",
    targetWpm: 35,
    handCompatibility: ["left", "right"],
    prerequisites: ["sentences-3"],
  },
  {
    id: "sentences-5",
    title: "Academic Writing",
    description: "Formal academic and professional prose",
    category: "sentences", 
    level: 5,
    difficulty: 4,
    content: "The systematic evaluation of user interface accessibility demonstrates the importance of inclusive design methodologies in contemporary software development practices. Furthermore, the integration of assistive technologies facilitates comprehensive user engagement across diverse demographic populations.",
    targetWpm: 38,
    handCompatibility: ["left", "right"],
    prerequisites: ["sentences-4"],
  },

  // ADVANCED CATEGORY - Challenging content
  {
    id: "advanced-1",
    title: "Mixed Content",
    description: "Combination of letters, numbers, and symbols",
    category: "advanced",
    level: 1,
    difficulty: 4,
    content: "Version 2.1.4 was released on March 15th, 2024. The API key is abc123-def456-ghi789. Email: user@example.com Phone: (555) 123-4567",
    targetWpm: 35,
    handCompatibility: ["left", "right"],
    prerequisites: ["sentences-3"],
  },
  {
    id: "advanced-2",
    title: "Code Snippets",
    description: "Programming code and syntax practice",
    category: "advanced",
    level: 2,
    difficulty: 5,
    content: "function calculateWPM(characters, timeInMinutes) { return Math.round(characters / 5 / timeInMinutes); } const result = calculateWPM(350, 5);",
    targetWpm: 32,
    handCompatibility: ["left", "right"],
    prerequisites: ["advanced-1"],
  },
  {
    id: "advanced-3",
    title: "Special Characters",
    description: "Advanced punctuation and special symbols",
    category: "advanced", 
    level: 3,
    difficulty: 5,
    content: "Special chars: @#$%^&*()_+-=[]{}|;':\",./<>? The cost is $29.99 (tax included). Rating: 4.5/5 stars! 100% satisfaction guaranteed.",
    targetWpm: 30,
    handCompatibility: ["left", "right"],
    prerequisites: ["advanced-2"],
  },
  {
    id: "advanced-4",
    title: "Data Entry",
    description: "Realistic data entry scenarios with mixed formats",
    category: "advanced",
    level: 4,
    difficulty: 5,
    content: "Customer: John Smith | ID: 12345 | DOB: 01/15/1985 | Address: 123 Main St, Apt 4B | ZIP: 90210 | Total: $1,234.56 | Status: ACTIVE",
    targetWpm: 35,
    handCompatibility: ["left", "right"],
    prerequisites: ["advanced-3"],
  },
  {
    id: "advanced-5",
    title: "Master Challenge", 
    description: "Ultimate typing challenge with all elements",
    category: "advanced",
    level: 5,
    difficulty: 5,
    content: "The OneType application (v3.2.1) revolutionizes accessibility in typing education. Features include: 1) One-handed layouts, 2) Real-time feedback, 3) Achievement system, 4) WCAG 2.1 AA compliance. Visit https://onetype.app for more information!",
    targetWpm: 40,
    timeLimit: 180,
    handCompatibility: ["left", "right"],
    prerequisites: ["advanced-4"],
  },

  // SPECIALIZED LESSONS FOR SPECIFIC HANDS
  {
    id: "left-special-1",
    title: "Left-Hand Optimization",
    description: "Specially designed for left-hand efficiency",
    category: "basics",
    level: 6,
    difficulty: 3,
    content: "qwert asdfg zxcvb trade craft badge exact water treat great createstead bread thread",
    targetWpm: 30,
    handCompatibility: ["left"],
    prerequisites: ["basics-5"],
  },
  {
    id: "right-special-1", 
    title: "Right-Hand Optimization",
    description: "Specially designed for right-hand efficiency",
    category: "basics",
    level: 6,
    difficulty: 3,
    content: "yuiop hjkl; nm,./ union point joint pilot pilot union point minimum opinion policy",
    targetWpm: 30,
    handCompatibility: ["right"],
    prerequisites: ["basics-5"],
  },
];

// Bundled lessons (the app is local-first; there is no remote source).
export const lessons: Lesson[] = staticLessons;

// Helper functions that work with the dynamic lessons array
export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

export function getLessonsByCategory(category: Lesson['category']): Lesson[] {
  return lessons.filter(lesson => lesson.category === category);
}

export function getLessonsForHand(handPreference: 'left' | 'right'): Lesson[] {
  return lessons.filter(lesson => lesson.handCompatibility.includes(handPreference));
}

export function getUnlockedLessons(completedLessons: string[]): Lesson[] {
  return lessons.filter(lesson => {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
      return true;
    }
    return lesson.prerequisites.every(prereq => completedLessons.includes(prereq));
  });
}

export function getNextLesson(currentLessonId: string, completedLessons: string[]): Lesson | null {
  const currentLesson = getLessonById(currentLessonId);
  if (!currentLesson) return null;

  const unlockedLessons = getUnlockedLessons(completedLessons);
  const nextLessons = unlockedLessons.filter(lesson => 
    lesson.category === currentLesson.category && 
    lesson.level === currentLesson.level + 1
  );

  return nextLessons[0] || null;
}
