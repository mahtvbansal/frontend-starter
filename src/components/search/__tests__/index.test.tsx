import { describe, expect, it, vi } from 'vitest';
import SearchBar from '@/components/search';
import { render, screen, waitFor } from '@/test/test-utils';

describe('SearchBar', () => {
  it('updates textbox value and forwards onChange events', async () => {
    const handleChange = vi.fn();
    const { user } = render(<SearchBar label="Search" onChange={handleChange} />);

    const textbox = screen.getByRole('textbox', { name: /search/i });
    await user.type(textbox, 'invoice 101');

    expect(textbox).toHaveValue('invoice 101');
    expect(handleChange).toHaveBeenCalled();
  });

  it('calls debounced callback with latest value only', async () => {
    const handleDebouncedChange = vi.fn();
    const { user } = render(
      <SearchBar debounceMs={25} label="Search" onDebouncedChange={handleDebouncedChange} />
    );

    await user.type(screen.getByRole('textbox', { name: /search/i }), 'abc');

    await waitFor(() => {
      expect(handleDebouncedChange).toHaveBeenCalledWith('abc');
    });
    expect(handleDebouncedChange).toHaveBeenCalledTimes(1);
  });

  it('syncs internal value from controlled prop updates', () => {
    const { rerender } = render(<SearchBar label="Search" value="draft" />);

    expect(screen.getByRole('textbox', { name: /search/i })).toHaveValue('draft');

    rerender(<SearchBar label="Search" value="paid" />);

    expect(screen.getByRole('textbox', { name: /search/i })).toHaveValue('paid');
  });
});
