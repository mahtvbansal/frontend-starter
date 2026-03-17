import { describe, expect, it, vi, afterEach } from 'vitest';
import ErrorBoundary from '@/components/ErrorBoundary';
import { fireEvent, render, screen } from '@/test/test-utils';

const ThrowingComponent = (): JSX.Element => {
  throw new Error('Boundary failure');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Healthy content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText(/healthy content/i)).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('renders fallback page when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred\. please refresh and try again\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/boundary failure/i)).toBeInTheDocument();
  });

  it('reloads the page from the fallback action', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        reload: reloadSpy,
      },
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));

    expect(reloadSpy).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });
});
