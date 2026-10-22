import { staticLessons, type Lesson } from '../lib/lessons';

interface UseDataLoaderReturn {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

/**
 * Local-first data loader: all lessons ship with the app.
 * No network, no server — works fully offline.
 */
export function useDataLoader(): UseDataLoaderReturn {
  return { lessons: staticLessons, loading: false, error: null };
}
