import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  configurable: true,
  value: function requestSubmit(): void {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  },
});

vi.mock('@/context/AuthContext', async () =>
  import('@/test/mocks/auth-context').then((module) => ({
    AuthProvider: module.AuthProvider,
    useAuth: module.useAuth,
  }))
);

afterEach(() => {
  cleanup();
});
