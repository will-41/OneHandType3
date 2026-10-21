import { Route, Router, Switch, useLocation, useRoute } from 'wouter';
import { lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';

// Home loads eagerly (first screen); every other route is split into its
// own chunk so the initial download stays small on phones.
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const KeyboardBuilderPage = lazy(() => import('./pages/KeyboardBuilderPage'));
const TutorialPage = lazy(() => import('./pages/TutorialPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFound = lazy(() => import('./pages/not-found'));
import { useDataLoader } from './hooks/useDataLoader';
import { gamifiedCurriculum } from './lib/gamifiedCurriculum';
import ErrorBoundary from './components/ErrorBoundary';
const LessonRenderer = lazy(() => import('./components/LessonRenderer'));
import AppShell from './components/shell/AppShell';
import { useDocumentTheme } from './lib/theme';

/** Navigate back in history when possible, otherwise fall back to a route. */
function useGoBack(fallback = '/'): () => void {
  const [, navigate] = useLocation();
  return () => {
    if (window.history.length > 1) window.history.back();
    else navigate(fallback);
  };
}

function LessonRoute() {
  const [, params] = useRoute<{ id: string }>('/lesson/:id');
  const { lessons } = useDataLoader();
  const goBack = useGoBack('/');
  const id = params?.id ? decodeURIComponent(params.id) : '';
  return (
    <ErrorBoundary componentName="LessonPage">
      <LessonRenderer
        key={id}
        selectedLessonId={id}
        lessons={lessons}
        gamifiedCurriculum={gamifiedCurriculum}
        onBack={goBack}
      />
    </ErrorBoundary>
  );
}

const FIRST_LESSON_ID = gamifiedCurriculum[0]?.lessons[0]?.id ?? 'lesson-1-1';

function TutorialRoute() {
  const [, navigate] = useLocation();
  return (
    <ErrorBoundary componentName="TutorialPage">
      <TutorialPage
        onFinish={(dest) => navigate(dest === 'lesson' ? `/lesson/${FIRST_LESSON_ID}` : '/', { replace: true })}
      />
    </ErrorBoundary>
  );
}

function page(name: string, element: JSX.Element) {
  return <ErrorBoundary componentName={name}>{element}</ErrorBoundary>;
}

export default function App() {
  useDocumentTheme();

  return (
    <ErrorBoundary componentName="MainApp">
      <Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppShell>
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
        <Switch>
          <Route path="/">{page('HomePage', <HomePage />)}</Route>
          <Route path="/curriculum">{page('CurriculumPage', <CurriculumPage />)}</Route>
          <Route path="/practice">{page('PracticePage', <PracticePage />)}</Route>
          <Route path="/lesson/:id" component={LessonRoute} />
          <Route path="/stats">{page('StatsPage', <StatsPage />)}</Route>
          <Route path="/settings">{page('SettingsPage', <SettingsPage />)}</Route>
          {/* Tab bar stays visible on the builder (AppShell only hides it on /lesson and /tutorial); Settings tab stays highlighted. */}
          <Route path="/settings/keyboard-builder">{page('KeyboardBuilderPage', <KeyboardBuilderPage />)}</Route>
          <Route path="/settings/keyboard-builder/:id">{page('KeyboardBuilderPage', <KeyboardBuilderPage />)}</Route>
          <Route path="/tutorial" component={TutorialRoute} />
          <Route path="/about">{page('AboutPage', <AboutPage />)}</Route>
          <Route path="/privacy">{page('PrivacyPage', <PrivacyPage />)}</Route>
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </AppShell>
      </Router>
    </ErrorBoundary>
  );
}
