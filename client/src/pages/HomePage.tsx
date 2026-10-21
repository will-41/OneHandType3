import { useLocation } from 'wouter';
import { Button } from "../components/ui/button.tsx";
import { Card } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Play, BookOpen, Target, Clock, Zap, Crown, RefreshCw } from 'lucide-react';
import { gamifiedCurriculum } from '../lib/gamifiedCurriculum';
import { useDataLoader } from '../hooks/useDataLoader';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { mirrorRow } from '../lib/theme';

export default function HomePage() {
  const [, navigate] = useLocation();
  const { lessons } = useDataLoader();
  const hand = useTypingStore((s) => s.handPreference);

  const handleStartLesson = (lessonId: string) => {
    if (!lessonId) return;
    navigate(`/lesson/${encodeURIComponent(lessonId)}`);
  };

  const startJourney = () => {
    const first = gamifiedCurriculum[0]?.lessons[0];
    navigate(first ? `/lesson/${encodeURIComponent(first.id)}` : '/curriculum');
  };

  const basicLessons = lessons.filter(lesson => lesson.category === 'basics').slice(0, 6);
  const wordLessons = lessons.filter(lesson => lesson.category === 'words').slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            OneType
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Master one-handed typing with personalized lessons
          </p>

          <div className={`flex flex-col gap-4 justify-center ${mirrorRow(hand) === 'flex-row-reverse' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
            <Button 
              onClick={() => navigate('/tutorial')}
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Tutorial
            </Button>
            <Button 
              onClick={() => basicLessons.length > 0 && handleStartLesson(basicLessons[0].id)}
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={basicLessons.length === 0}
            >
              <Play className="h-5 w-5 mr-2" />
              Quick Start
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {lessons.length === 0 && (
          <div className="mb-8">
            <Card className="p-6 bg-accent/10 border-accent/50">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-semibold text-accent">Loading Lessons</h3>
                  <p className="text-muted-foreground text-sm">
                    Lesson content is still loading...
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Refresh
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Lesson Categories */}
        <div className="space-y-12">
          {/* Basics Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-success" />
              <h2 className="text-2xl font-bold">Basics</h2>
              <Badge variant="secondary">Start here</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {basicLessons.length > 0 ? (
                basicLessons.map((lesson) => (
                  <Card key={lesson.id} className="p-6 bg-card border-border hover:border-success transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                        <p className="text-muted-foreground text-sm">{lesson.description}</p>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        {lesson.difficulty}/5
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {lesson.targetWpm} WPM
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.estimatedMinutes} min
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-success text-success-foreground hover:bg-success/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 bg-card border-border text-center">
                    <div className="text-muted-foreground mb-4">
                      No basic lessons loaded yet
                    </div>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Lessons
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Words Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">Words</h2>
              <Badge variant="secondary">Build vocabulary</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wordLessons.length > 0 ? (
                wordLessons.map((lesson) => (
                  <Card key={lesson.id} className="p-6 bg-card border-border hover:border-accent transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                        <p className="text-muted-foreground text-sm">{lesson.description}</p>
                      </div>
                      <Badge variant="outline" className="text-accent border-accent">
                        {lesson.difficulty}/5
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {lesson.targetWpm} WPM
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.estimatedMinutes} min
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 bg-card border-border text-center">
                    <div className="text-muted-foreground mb-4">
                      Word lessons will appear here once loaded
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Realm of Keys Academy */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Realm of Keys Academy</h2>
            </div>

            <div>
              <Card className="p-8 bg-gradient-to-r from-primary/25 to-secondary border-primary/50">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Journey Through the Realms</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Master typing on an original fantasy journey. 
                    Build your skills as you travel through ten realms, from the warm Hearthlands to the Crown of Keys.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={startJourney}
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Begin Your Journey
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}