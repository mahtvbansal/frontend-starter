import { describe, expect, it } from 'vitest';
import type { ReactElement } from 'react';
import { appRouter } from '@/routes/app-router';

interface RouteNode {
  path?: string;
  index?: boolean;
  element?: ReactElement;
  children?: RouteNode[];
}

const collectRequiredPermissions = (nodes: RouteNode[]): string[] => {
  const permissions: string[] = [];

  const visit = (routeNodes: RouteNode[]): void => {
    routeNodes.forEach((node) => {
      const permission = node.element?.props?.requiredPermission;

      if (typeof permission === 'string') {
        permissions.push(permission);
      }

      if (node.children) {
        visit(node.children);
      }
    });
  };

  visit(nodes);

  return permissions;
};

const findIndexRedirectRoute = (nodes: RouteNode[]): RouteNode | undefined => {
  for (const node of nodes) {
    if (node.index && node.element?.props?.to === '/invoices' && node.element?.props?.replace) {
      return node;
    }

    if (node.children) {
      const nested = findIndexRedirectRoute(node.children);

      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
};

describe('appRouter', () => {
  it('registers key top-level paths and fallbacks', () => {
    const routes = appRouter.routes as RouteNode[];

    const wildcardRoute = routes.find((route) => route.path === '*');
    const authBranch = routes.find((route) =>
      route.children?.some((child) => child.path === '/login' || child.path === '/signup')
    );

    expect(routes.length).toBeGreaterThanOrEqual(3);
    expect(authBranch).toBeDefined();
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.element?.props?.to).toBe('/invoices');
  });

  it('guards invoice routes with expected permissions', () => {
    const routes = appRouter.routes as RouteNode[];
    const permissions = collectRequiredPermissions(routes);

    expect(permissions).toEqual([
      'invoices:read',
      'invoices:create',
      'invoices:read',
      'invoices:update',
    ]);
  });

  it('defines an index redirect to invoices inside app layout branch', () => {
    const routes = appRouter.routes as RouteNode[];

    const indexRoute = findIndexRedirectRoute(routes);

    expect(indexRoute).toBeDefined();
    expect(indexRoute?.element?.props?.to).toBe('/invoices');
    expect(indexRoute?.element?.props?.replace).toBe(true);
  });
});
