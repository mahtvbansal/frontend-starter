import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  EMAIL_INVALID_ERROR,
  PASSWORD_MIN_LENGTH_ERROR,
  SIGNUP_ERROR_FALLBACK,
} from '@/pages/auth/signup/constants';
import useSignupFormState from '@/pages/auth/signup/hooks/useSignupFormState';

describe('useSignupFormState', () => {
  it('returns validation errors and avoids API call for invalid form', async () => {
    const signupMock = vi.fn();
    const { result } = renderHook(() => useSignupFormState({ signup: signupMock }));

    act(() => {
      result.current.setEmail('invalid-email');
      result.current.setPassword('1234');
    });

    await act(async () => {
      const submitResult = await result.current.submitSignup();
      expect(submitResult).toEqual({ ok: false });
    });

    expect(result.current.formErrors.email).toBe(EMAIL_INVALID_ERROR);
    expect(result.current.formErrors.password).toBe(PASSWORD_MIN_LENGTH_ERROR);
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('submits valid signup data including selected role', async () => {
    const signupMock = vi.fn().mockResolvedValue({ data: { token: 'token' } });
    const { result } = renderHook(() => useSignupFormState({ signup: signupMock }));

    act(() => {
      result.current.setEmail('qa@invoicepro.com');
      result.current.setPassword('password123');
      result.current.setRole('Admin');
    });

    await act(async () => {
      const submitResult = await result.current.submitSignup();
      expect(submitResult).toEqual({ ok: true });
    });

    expect(signupMock).toHaveBeenCalledWith('qa@invoicepro.com', 'password123', 'Admin');
  });

  it('uses fallback error message when API error has no message', async () => {
    const signupMock = vi.fn().mockResolvedValue({ error: {} });
    const { result } = renderHook(() => useSignupFormState({ signup: signupMock }));

    act(() => {
      result.current.setEmail('qa@invoicepro.com');
      result.current.setPassword('password123');
    });

    await act(async () => {
      const submitResult = await result.current.submitSignup();
      expect(submitResult).toEqual({ ok: false });
    });

    expect(result.current.serverError).toBe(SIGNUP_ERROR_FALLBACK);
  });
});
