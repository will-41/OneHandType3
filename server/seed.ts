
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { lessons, achievements, curriculumLevels, curriculumLessons } from "../shared/schema";
import { staticLessons } from "../client/src/lib/lessons";
import { gamifiedCurriculum } from "../client/src/lib/gamifiedCurriculum";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Clear existing data
    await db.delete(lessons);
    await db.delete(curriculumLessons);
    await db.delete(curriculumLevels);
    console.log("🗑️ Cleared existing lessons and curriculum");
    
    // Insert all static lessons into database
    for (const lesson of staticLessons) {
      const lessonData = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        level: lesson.level,
        difficulty: lesson.difficulty,
        content: lesson.content,
        targetWpm: lesson.targetWpm,
        timeLimit: lesson.timeLimit || null,
        handCompatibility: JSON.stringify(lesson.handCompatibility),
        focusKeys: lesson.focusKeys ? JSON.stringify(lesson.focusKeys) : null,
        prerequisites: lesson.prerequisites ? JSON.stringify(lesson.prerequisites) : null,
        wordCount: lesson.wordCount || null,
        estimatedTime: lesson.estimatedTime || null
      };
      
      await db.insert(lessons).values(lessonData);
      console.log(`✅ Inserted lesson: ${lesson.id} - ${lesson.title}`);
    }

    // Insert Game of Thrones curriculum levels
    for (const level of gamifiedCurriculum) {
      const levelData = {
        id: level.id,
        title: level.title,
        description: level.description,
        gotTheme: level.gotTheme,
        levelRewards: level.levelRewards,
        unlockRequirements: level.unlockRequirements,
        estimatedCompletionTime: level.estimatedCompletionTime,
        accessibilityFocus: level.accessibilityFocus
      };
      
      await db.insert(curriculumLevels).values(levelData);
      console.log(`🏰 Inserted curriculum level: ${level.id} - ${level.title}`);

      // Insert lessons for this level
      for (const lesson of level.lessons) {
        const curriculumLessonData = {
          id: lesson.id,
          levelId: level.id,
          title: lesson.title,
          description: lesson.description,
          gotTheme: lesson.gotTheme,
          skills: lesson.skills,
          targetWpm: lesson.targetWpm,
          targetAccuracy: String(lesson.targetAccuracy), // Convert number to string for PostgreSQL decimal field
          content: lesson.content,
          practiceText: lesson.practiceText,
          keyFocus: lesson.keyFocus,
          estimatedTime: lesson.estimatedTime,
          difficulty: lesson.difficulty,
          prerequisites: lesson.prerequisites,
          unlockRequirements: lesson.unlockRequirements,
          rewards: lesson.rewards,
          adaptiveFeatures: lesson.adaptiveFeatures
        };
        
        await db.insert(curriculumLessons).values(curriculumLessonData);
        console.log(`⚔️ Inserted curriculum lesson: ${lesson.id} - ${lesson.title}`);
      }
    }
    
    // Insert basic achievements
    const basicAchievements = [
      {
        id: "first-lesson",
        title: "First Steps",
        description: "Complete your first lesson",
        category: "milestone",
        rarity: "common",
        points: 10
      },
      {
        id: "speed-demon",
        title: "Speed Demon",
        description: "Reach 30 WPM",
        category: "speed",
        rarity: "rare",
        points: 50
      },
      {
        id: "accuracy-ace",
        title: "Accuracy Ace",
        description: "Achieve 95% accuracy",
        category: "accuracy",
        rarity: "epic",
        points: 75
      },
      {
        id: "basics-master",
        title: "Basics Master",
        description: "Complete all basic lessons",
        category: "milestone",
        rarity: "rare",
        points: 100
      }
    ];
    
    // Clear existing achievements
    await db.delete(achievements);
    console.log("🗑️ Cleared existing achievements");
    
    for (const achievement of basicAchievements) {
      await db.insert(achievements).values(achievement);
      console.log(`🏆 Inserted achievement: ${achievement.id} - ${achievement.title}`);
    }
    
    console.log("🎉 Database seeding completed successfully!");
    console.log(`📚 Inserted ${staticLessons.length} basic lessons`);
    console.log(`🏰 Inserted ${gamifiedCurriculum.length} curriculum levels`);
    const totalCurriculumLessons = gamifiedCurriculum.reduce((total, level) => total + level.lessons.length, 0);
    console.log(`⚔️ Inserted ${totalCurriculumLessons} curriculum lessons`);
    console.log(`🏆 Inserted ${basicAchievements.length} achievements`);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log("✨ Seeding process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding process failed:", error);
    process.exit(1);
  });
