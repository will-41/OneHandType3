// API client for OneType database integration
import { Lesson } from '../lib/lessons';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
const API_TIMEOUT = 10000; // 10 seconds timeout

// Helper function to handle fetch with timeout
async function fetchWithTimeout(resource: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    throw error;
  }
}

// API Response types
interface ApiResponse<T> {
  [key: string]: T;
}

interface LessonsResponse {
  lessons: Lesson[];
}

interface LessonResponse {
  lesson: Lesson;
}

interface CurriculumResponse {
  levels: any[];
}

interface AchievementsResponse {
  achievements: any[];
}

interface ProgressResponse {
  progress: any[];
}

// API Functions
export const api = {
  // Lesson Management
  async getAllLessons(): Promise<Lesson[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/lessons`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LessonsResponse = await response.json();
      return data.lessons;
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      return [];
    }
  },

  async getLessonById(id: string): Promise<Lesson | null> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/lessons/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LessonResponse = await response.json();
      return data.lesson;
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error);
      return null;
    }
  },

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/lessons?category=${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LessonsResponse = await response.json();
      return data.lessons;
    } catch (error) {
      console.error(`Failed to fetch lessons for category ${category}:`, error);
      return [];
    }
  },

  // Curriculum Management
  async getCurriculumLevels(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/curriculum`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CurriculumResponse = await response.json();
      return data.levels;
    } catch (error) {
      console.error('Failed to fetch curriculum levels:', error);
      return [];
    }
  },

  async getCurriculumLessons(levelId: string): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/curriculum/${levelId}/lessons`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.lessons;
    } catch (error) {
      console.error(`Failed to fetch lessons for level ${levelId}:`, error);
      return [];
    }
  },

  // Achievement Management
  async getAllAchievements(): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/achievements`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AchievementsResponse = await response.json();
      return data.achievements;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return [];
    }
  },

  // User Progress Management
  async getUserProgress(userId: number): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/users/${userId}/progress`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ProgressResponse = await response.json();
      return data.progress;
    } catch (error) {
      console.error(`Failed to fetch progress for user ${userId}:`, error);
      return [];
    }
  },

  async updateUserProgress(userId: number, lessonId: string, wpm: number, accuracy: number, completed: boolean): Promise<any | null> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/users/${userId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          wpm,
          accuracy,
          completed,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to update progress for user ${userId}:`, error);
      return null;
    }
  },

  // Health Check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
};

// Helper functions for data transformation
export const transformLessonData = (dbLesson: any): Lesson => {
  return {
    id: dbLesson.id,
    title: dbLesson.title,
    description: dbLesson.description,
    category: dbLesson.category as Lesson['category'],
    level: dbLesson.level,
    difficulty: dbLesson.difficulty,
    content: dbLesson.content,
    text: dbLesson.content, // Backward compatibility
    targetWpm: dbLesson.targetWpm,
    timeLimit: dbLesson.timeLimit,
    handCompatibility: dbLesson.handCompatibility || ["left", "right"],
    focusKeys: dbLesson.focusKeys || [],
    prerequisites: dbLesson.prerequisites || [],
    wordCount: dbLesson.wordCount,
    estimatedTime: dbLesson.estimatedTime
  };
};