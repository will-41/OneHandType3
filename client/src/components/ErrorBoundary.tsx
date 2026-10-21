import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Keeps a crash in one screen from taking down the whole app and shows a
 * friendly, accessible fallback with a way to recover. Nothing is logged or
 * sent anywhere: the app is fully local and has no error-reporting service.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div role="alert" className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">
          This screen hit a problem. Your progress is saved on this device. Try again, or head back home.
        </p>
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border px-5 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
