import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_LOGIN_REDIRECT,
  EMAIL_INVALID_ERROR,
  LOGIN_ERROR_FALLBACK,
  PASSWORD_MIN_LENGTH_ERROR,
} from '@/pages/auth/login/constants';
import useLoginFormState from '@/pages/auth/login/hooks/useLoginFormState';

describe('useLoginFormState', () => {
  it('returns validation errors and blocks submit for invalid input', async () => {
    const loginMock = vi.fn();
    const { result } = renderHook(() => useLoginFormState({ login: loginMock }));

    act(() => {
      result.current.setEmail('invalid-email');
      result.current.setPassword('12345');
    });

    await act(async () => {
      const submitResult = await result.current.submitLogin();
      expect(submitResult.ok).toBe(false);
    });

    expect(result.current.formErrors.email).toBe(EMAIL_INVALID_ERROR);
    expect(result.current.formErrors.password).toBe(PASSWORD_MIN_LENGTH_ERROR);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('returns destination from path when login succeeds', async () => {
    const loginMock = vi.fn().mockResolvedValue({ data: { token: 'token' } });
    const { result } = renderHook(() =>
      useLoginFormState({
        login: loginMock,
        fromPath: '/invoices/private',
      })
    );

    act(() => {
      result.current.setEmail('qa@invoicepro.com');
      result.current.setPassword('password123');
    });

    await act(async () => {
      const submitResult = await result.current.submitLogin();
      expect(submitResult).toEqual({ ok: true, destination: '/invoices/private' });
    });

    expect(loginMock).toHaveBeenCalledWith('qa@invoicepro.com', 'password123');
  });

  it('uses default redirect and fallback error message when server error has no message', async () => {
    const loginMock = vi.fn().mockResolvedValue({ error: {} });
    const { result } = renderHook(() => useLoginFormState({ login: loginMock }));

    act(() => {
      result.current.setEmail('qa@invoicepro.com');
      result.current.setPassword('password123');
    });

    await act(async () => {
      const submitResult = await result.current.submitLogin();
      expect(submitResult).toEqual({ ok: false });
    });

    expect(result.current.serverError).toBe(LOGIN_ERROR_FALLBACK);

    loginMock.mockResolvedValueOnce({ data: { token: 'token' } });
    await act(async () => {
      const submitResult = await result.current.submitLogin();
      expect(submitResult).toEqual({ ok: true, destination: DEFAULT_LOGIN_REDIRECT });
    });
  });
});
