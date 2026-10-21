import { Route, Router, Switch, useLocation, useRoute } from 'wouter';
import HomePage from './pages/HomePage';
import CurriculumPage from './pages/CurriculumPage';
import PracticePage from './pages/PracticePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import KeyboardBuilderPage from './pages/KeyboardBuilderPage';
import TutorialPage from './pages/TutorialPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/not-found';
import { useDataLoader } from './hooks/useDataLoader';
import { gamifiedCurriculum } from './lib/gamifiedCurriculum';
import ErrorBoundary from './components/ErrorBoundary';
import LessonRenderer from './components/LessonRenderer';
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

function TutorialRoute() {
  const [, navigate] = useLocation();
  return (
    <ErrorBoundary componentName="TutorialPage">
      <TutorialPage onComplete={() => navigate('/')} />
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
      </AppShell>
      </Router>
    </ErrorBoundary>
  );
}
