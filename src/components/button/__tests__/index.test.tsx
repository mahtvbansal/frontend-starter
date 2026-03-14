import { describe, expect, it, vi } from 'vitest';
import AppButton from '@/components/button';
import { render, screen } from '@/test/test-utils';

describe('AppButton', () => {
  it('renders children and triggers click when enabled', async () => {
    const handleClick = vi.fn();
    const { user } = render(<AppButton onClick={handleClick}>Create invoice</AppButton>);

    await user.click(screen.getByRole('button', { name: /create invoice/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button and shows progressbar when loading', () => {
    render(<AppButton isLoading>Save</AppButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
  });

  it('respects disabled prop when not loading', () => {
    render(<AppButton disabled>Disabled</AppButton>);

    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });
});
