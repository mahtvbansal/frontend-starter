import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';
import Root from '@/Root';
import { appRouter } from '@/routes/app-router';
import { theme } from '@/theme';

const routerProviderMock = vi.fn<[{ router: typeof appRouter }], JSX.Element>(() => (
  <div>Router Provider</div>
));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    RouterProvider: (props: { router: typeof appRouter }) => routerProviderMock(props),
  };
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Root', () => {
  it('renders RouterProvider with the central app router', () => {
    renderWithTheme(<Root />);

    expect(routerProviderMock).toHaveBeenCalledWith(expect.objectContaining({ router: appRouter }));
  });
});
