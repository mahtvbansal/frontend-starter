import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorBoundaryPage from '@/components/ErrorBoundary/ErrorBoundaryPage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Keep a simple console log for now; this can be replaced with Sentry/New Relic later.
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorBoundaryPage error={error} />;
    }

    return children;
  }
}

export default ErrorBoundary;
