import { useState, useEffect } from 'react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  content: string;
  targetWpm: number;
  estimatedMinutes: number;
}

interface UseDataLoaderReturn {
  lessons: Lesson[] | null;
  loading: boolean;
  error: string | null;
}

export function useDataLoader(): UseDataLoaderReturn {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading lessons from API...');

        // Try to connect to the API
        const response = await fetch('/api/lessons', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);

        if (data.lessons && Array.isArray(data.lessons)) {
          setLessons(data.lessons);
          console.log(`✅ Loaded ${data.lessons.length} lessons`);
        } else {
          console.warn('⚠️ No lessons in API response, using empty array');
          setLessons([]);
        }

        setError(null);
      } catch (err) {
        console.error('❌ Failed to load lessons:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unable to connect to server';
        setError(`Failed to load lessons: ${errorMessage}`);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { lessons, loading, error };
}