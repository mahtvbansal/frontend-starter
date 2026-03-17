import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '@/components/ErrorBoundary';
import Root from '@/Root';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  __esModule: true,
  default: {
    createRoot: createRootMock,
  },
}));

describe('main', () => {
  it('mounts app to #root with ThemeProvider, ErrorBoundary, and Root', async () => {
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    await import('@/main');

    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalledTimes(1);
    const [app] = renderMock.mock.calls[0];
    expect(app.type.toString()).toContain('ThemeProvider');
    const children = Array.isArray(app.props.children) ? app.props.children : [app.props.children];
    const errorBoundaryNode = children.find((c: React.ReactElement) => c?.type === ErrorBoundary);

    expect(errorBoundaryNode).toBeDefined();
    expect(errorBoundaryNode.props.children.type).toBe(Root);

    document.body.removeChild(rootEl);
  });
});
