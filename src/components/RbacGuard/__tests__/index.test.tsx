import { describe, expect, it } from 'vitest';
import PermissionGuard from '@/components/RbacGuard';
import { render, screen } from '@/test/test-utils';

describe('PermissionGuard', () => {
  it('renders children when permission check passes', () => {
    render(
      <PermissionGuard permission="invoices:delete">
        <button type="button">Delete</button>
      </PermissionGuard>,
      {
        authValue: {
          hasPermission: () => true,
        },
      }
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders fallback and hides children when permission check fails', () => {
    render(
      <PermissionGuard fallback={<span>No access</span>} permission="invoices:delete">
        <button type="button">Delete</button>
      </PermissionGuard>,
      {
        authValue: {
          hasPermission: () => false,
        },
      }
    );

    expect(screen.getByText(/no access/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('uses null fallback by default when permission check fails', () => {
    const { container } = render(
      <PermissionGuard permission="invoices:delete">
        <button type="button">Delete</button>
      </PermissionGuard>,
      {
        authValue: {
          hasPermission: () => false,
        },
      }
    );

    expect(container).toBeEmptyDOMElement();
  });
});
