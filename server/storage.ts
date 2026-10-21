import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  users, lessons, curriculumLevels, curriculumLessons, userProgress, 
  userStats, achievements, userAchievements, userSettings,
  type User, type InsertUser, type Lesson, type CurriculumLevel, 
  type CurriculumLesson, type UserProgress, type UserStats, 
  type Achievement, type UserAchievement, type UserSettings
} from "../shared/schema";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lesson management
  getAllLessons(): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | undefined>;
  getLessonsByCategory(category: string): Promise<Lesson[]>;
  
  // Curriculum management
  getAllCurriculumLevels(): Promise<CurriculumLevel[]>;
  getCurriculumLessons(levelId: string): Promise<CurriculumLesson[]>;
  
  // Achievement management
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  
  // User progress tracking
  getUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(userId: number, lessonId: string, wpm: number, accuracy: number, completed: boolean): Promise<UserProgress>;
  saveUserProgress(progress: { userId: number; lessonId: string; lessonType: string; wpm: number; accuracy: number; completed: boolean; timeSpent: number; }): Promise<UserProgress>;
  
  // User settings
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.replitId === replitId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    
    // Use type assertion to handle Zod-inferred InsertUser type safely
    const username = (insertUser as any)?.username || "";
    const password = (insertUser as any)?.password || null;
    
    const user: User = { 
      id, 
      username,
      password,
      replitId: null,
      displayName: null,
      profileImage: null,
      isReplitUser: false,
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  // MemStorage fallback methods (basic implementations)
  async getAllLessons(): Promise<Lesson[]> { return []; }
  async getLessonById(id: string): Promise<Lesson | undefined> { return undefined; }
  async getLessonsByCategory(category: string): Promise<Lesson[]> { return []; }
  async getAllCurriculumLevels(): Promise<CurriculumLevel[]> { return []; }
  async getCurriculumLessons(levelId: string): Promise<CurriculumLesson[]> { return []; }
  async getAllAchievements(): Promise<Achievement[]> { return []; }
  async getUserAchievements(userId: number): Promise<UserAchievement[]> { return []; }
  async getUserProgress(userId: number): Promise<UserProgress[]> { return []; }
  async updateUserProgress(userId: number, lessonId: string, wpm: number, accuracy: number, completed: boolean): Promise<UserProgress> { 
    throw new Error("MemStorage progress tracking not implemented"); 
  }
  async getUserSettings(userId: number): Promise<UserSettings | undefined> { return undefined; }
  async updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings> { 
    throw new Error("MemStorage settings not implemented"); 
  }
  async saveUserProgress(progress: { userId: number; lessonId: string; lessonType: string; wpm: number; accuracy: number; completed: boolean; timeSpent: number; }): Promise<UserProgress> {
    throw new Error("MemStorage progress tracking not implemented");
  }
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.replitId, replitId));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Lesson management
  async getAllLessons(): Promise<Lesson[]> {
    return await this.db.select().from(lessons);
  }

  async getLessonById(id: string): Promise<Lesson | undefined> {
    const result = await this.db.select().from(lessons).where(eq(lessons.id, id));
    return result[0];
  }

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    return await this.db.select().from(lessons).where(eq(lessons.category, category));
  }

  // Curriculum management
  async getAllCurriculumLevels(): Promise<CurriculumLevel[]> {
    return await this.db.select().from(curriculumLevels);
  }

  async getCurriculumLessons(levelId: string): Promise<CurriculumLesson[]> {
    return await this.db.select().from(curriculumLessons).where(eq(curriculumLessons.levelId, levelId));
  }

  // Achievement management
  async getAllAchievements(): Promise<Achievement[]> {
    return await this.db.select().from(achievements);
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await this.db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  // User progress tracking
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await this.db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(userId: number, lessonId: string, wpm: number, accuracy: number, completed: boolean): Promise<UserProgress> {
    const existing = await this.db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));

    if (existing.length > 0) {
      const result = await this.db.update(userProgress)
        .set({
          attempts: (existing[0].attempts || 0) + 1,
          bestWpm: Math.max(parseFloat(existing[0].bestWpm || "0"), wpm).toString(),
          bestAccuracy: Math.max(parseFloat(existing[0].bestAccuracy || "0"), accuracy).toString(),
          isCompleted: completed,
          lastAttemptAt: new Date(),
          completedAt: completed ? new Date() : existing[0].completedAt,
          updatedAt: new Date()
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(userProgress).values({
        userId,
        lessonId,
        lessonType: "lesson",
        attempts: 1,
        bestWpm: wpm.toString(),
        bestAccuracy: accuracy.toString(),
        isCompleted: completed,
        lastAttemptAt: new Date(),
        completedAt: completed ? new Date() : null
      }).returning();
      return result[0];
    }
  }

  // User settings
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const result = await this.db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return result[0];
  }

  async updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    
    if (existing) {
      const result = await this.db.update(userSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(userSettings.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(userSettings).values({
        userId,
        ...settings
      }).returning();
      return result[0];
    }
  }

  async saveUserProgress(progress: { userId: number; lessonId: string; lessonType: string; wpm: number; accuracy: number; completed: boolean; timeSpent: number; }): Promise<UserProgress> {
    return this.updateUserProgress(progress.userId, progress.lessonId, progress.wpm, progress.accuracy, progress.completed);
  }
}

// Use DatabaseStorage if DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
