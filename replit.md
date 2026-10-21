# OneType - One-Handed Typing Game

## Project Overview
OneType is a comprehensive typing application designed for one-handed typing with accessibility features. It includes:
- Progressive typing lessons with difficulty levels
- Virtual keyboard with visual feedback
- Audio feedback system
- Gamification with achievements
- Premium themes and animations
- PWA capabilities with offline support
- Advanced accessibility settings

## Architecture
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + Radix UI components
- **State Management**: Zustand stores
- **Audio**: Howler.js for sound effects
- **Deployment**: Replit environment on port 5000

## Recent Changes
- **Rebrand**: Removed all third-party (copyrighted) themed content. Curriculum is now the original "Realm of Keys" theme. DB column `got_theme` is now `story_theme` (run `npm run db:push`, then re-seed).
- **2025-07-31**: Created Individual Lesson Pages for Basics Training
  - Built 6 dedicated lesson pages matching the design: IndexFingerFPage, IndexFingerJPage, IndexFingerComboPage, MiddleFingerDPage, MiddleFingerKPage, TwoKeyComboPage
  - Each page features custom UI with progress tracking, real-time WPM/accuracy stats, and visual text highlighting
  - Created LessonRouter component to route specific lesson IDs to their dedicated pages
  - Updated page structure with HomePage, LessonPage, and TutorialPage components
  - All basic lessons (basics-1 through basics-6) now have unique interactive interfaces
- **2025-07-31**: Complete Database Population and API Integration
  - Designed comprehensive database schema with 8 tables for full typing game functionality
  - Created tables: lessons, curriculum_levels, curriculum_lessons, user_progress, user_stats, achievements, user_achievements, user_settings
  - Populated database with 11 typing lessons (basics, words, sentences) and 11 achievements
  - Implemented the original Realm of Keys themed curriculum (10 levels, 29 lessons)
  - Built complete API endpoints for lesson management, progress tracking, and achievements
  - Full user progress tracking system operational (WPM, accuracy, completion status)
  - When users start lessons, real lesson data is now served from database
  - All typing game functionality connected to persistent PostgreSQL storage
- **2025-07-30**: PostgreSQL Database Integration with Neon Complete
  - Created PostgreSQL database instance using Neon serverless
  - Implemented DatabaseStorage class with full CRUD operations
  - Updated storage interface to use real database instead of in-memory
  - Successfully migrated schema using Drizzle ORM (`users` table created)
  - Added comprehensive API endpoints for testing database connectivity
  - All database operations verified and working correctly
  - Environment variables configured: DATABASE_URL, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, PGHOST
- **2025-01-30**: Comprehensive TypeScript error resolution (All errors fixed)
  - Fixed all React.FC<any> types with proper interfaces
  - Resolved undefined function invocation errors with optional chaining
  - Added proper TypingStats interface for statistics handling
  - Fixed curriculumProgress interface completeness
  - Eliminated all `any` types from critical components
  - TypeScript strict mode compilation now passes successfully
- **2025-01-30**: Fixed critical lesson navigation issues for investor presentation
  - Resolved duplicate Crown import crashes
  - Fixed type mismatches between CurriculumLesson and Lesson interfaces
  - Implemented proper lesson conversion in Realm of Keys Academy
  - Added comprehensive debugging throughout lesson flow
  - All navigation paths now fully functional (Start Typing + Realm of Keys Academy)
- **2025-01-29**: Migrated from Replit Agent to Replit environment
- Project structure verified with proper client/server separation
- All dependencies installed and working correctly
- Server running successfully on port 5000

## User Preferences
- None specified yet

## Technical Notes
- Server serves both API routes and static client files
- Development mode uses Vite dev server integration
- Production mode serves built static files
- Audio files located in `/client/public/sounds/`
- PWA manifest and service worker configured