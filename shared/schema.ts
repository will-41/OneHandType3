import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - updated for Replit Auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(), // Replit user ID
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  password: text("password"), // Optional for non-Replit users
  isReplitUser: boolean("is_replit_user").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons table - stores all lesson data
export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "basics" | "words" | "sentences" | "advanced" | "curriculum"
  level: integer("level").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  content: text("content").notNull(),
  targetWpm: integer("target_wpm").notNull(),
  timeLimit: integer("time_limit"), // in seconds
  handCompatibility: jsonb("hand_compatibility").notNull(), // ["left", "right"]
  focusKeys: jsonb("focus_keys"), // string array
  prerequisites: jsonb("prerequisites"), // string array of lesson IDs
  wordCount: integer("word_count"),
  estimatedTime: integer("estimated_time"), // minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Curriculum levels table - gamified curriculum structure
export const curriculumLevels = pgTable("curriculum_levels", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  storyTheme: jsonb("story_theme").notNull(), // Realm of Keys theme data
  levelRewards: jsonb("level_rewards").notNull(),
  unlockRequirements: jsonb("unlock_requirements").notNull(),
  estimatedCompletionTime: text("estimated_completion_time").notNull(),
  accessibilityFocus: jsonb("accessibility_focus").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Curriculum lessons table - lessons within curriculum levels
export const curriculumLessons = pgTable("curriculum_lessons", {
  id: text("id").primaryKey(),
  levelId: text("level_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  storyTheme: jsonb("story_theme").notNull(),
  skills: jsonb("skills").notNull(),
  targetWpm: integer("target_wpm").notNull(),
  targetAccuracy: decimal("target_accuracy", { precision: 5, scale: 2 }).notNull(),
  content: text("content").notNull(),
  practiceText: jsonb("practice_text").notNull(),
  keyFocus: jsonb("key_focus").notNull(),
  estimatedTime: integer("estimated_time").notNull(),
  difficulty: integer("difficulty").notNull(),
  prerequisites: jsonb("prerequisites").notNull(),
  unlockRequirements: jsonb("unlock_requirements").notNull(),
  rewards: jsonb("rewards").notNull(),
  adaptiveFeatures: jsonb("adaptive_features").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress table - tracks progress on lessons
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  lessonType: text("lesson_type").notNull(), // "lesson" | "curriculum"
  attempts: integer("attempts").default(0),
  completedCount: integer("completed_count").default(0),
  bestWpm: decimal("best_wpm", { precision: 5, scale: 2 }).default("0"),
  bestAccuracy: decimal("best_accuracy", { precision: 5, scale: 2 }).default("0"),
  totalTime: integer("total_time").default(0), // minutes
  isCompleted: boolean("is_completed").default(false),
  lastAttemptAt: timestamp("last_attempt_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User statistics table - overall typing stats
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  totalCharactersTyped: integer("total_characters_typed").default(0),
  totalErrors: integer("total_errors").default(0),
  totalTimeTyped: decimal("total_time_typed", { precision: 10, scale: 2 }).default("0"), // minutes
  bestWpm: decimal("best_wpm", { precision: 5, scale: 2 }).default("0"),
  bestAccuracy: decimal("best_accuracy", { precision: 5, scale: 2 }).default("0"),
  commonErrors: jsonb("common_errors").default("{}"), // Record<string, number>
  layoutSpecificStats: jsonb("layout_specific_stats").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievements table - achievement definitions
export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "speed" | "accuracy" | "consistency" | "milestone" | "special"
  rarity: text("rarity").notNull(), // "common" | "rare" | "epic" | "legendary"
  icon: text("icon"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements table - tracks user achievement unlocks
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings table - user preferences and settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  handPreference: text("hand_preference").default("right"), // "left" | "right"
  keyboardLayout: text("keyboard_layout").default("qwerty"),
  specializedLayout: text("specialized_layout"),
  colorTheme: text("color_theme").default("System Theme"),
  soundEnabled: boolean("sound_enabled").default(true),
  backgroundMusicEnabled: boolean("background_music_enabled").default(true),
  showTutorial: boolean("show_tutorial").default(true),
  difficultyPreference: integer("difficulty_preference").default(1),
  accessibilityOptions: jsonb("accessibility_options").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema exports
// Fix the way createInsertSchema is used - specify an object with properties instead of boolean values
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string().nullable().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type CurriculumLevel = typeof curriculumLevels.$inferSelect;
export type CurriculumLesson = typeof curriculumLessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
