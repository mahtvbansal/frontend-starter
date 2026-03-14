import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { apiFetch, configureApiClient } from '@/api/client';

/** @type {import('./AuthContext').AuthContextValue | null} */
const AuthContext = createContext(null);

const getPayloadRoot = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return payload;
};

const extractAuthSession = (payload, fallbackToken = '', fallbackUser = null) => {
  const root = getPayloadRoot(payload);
  const token = typeof root?.token === 'string' ? root.token : fallbackToken;
  const user = root?.user && typeof root.user === 'object' ? root.user : fallbackUser;

  return { token, user };
};

const normalizePermission = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef('');
  const userRef = useRef(null);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    configureApiClient({
      getToken: () => tokenRef.current,
      onTokenRefresh: (payload) => {
        const nextSession = extractAuthSession(payload, tokenRef.current, userRef.current);

        if (nextSession.token) {
          syncSession(nextSession.token, nextSession.user);
        }
      },
      onUnauthorized: () => {
        clearSession(false);

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      },
    });
  }, []);

  const syncSession = (nextToken, nextUser) => {
    tokenRef.current = nextToken;
    userRef.current = nextUser;
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = (shouldRedirect = false) => {
    tokenRef.current = '';
    userRef.current = null;
    setUser(null);
    setToken('');

    if (shouldRedirect && typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);

    const refreshResult = await apiFetch('/auth/refresh', {
      method: 'POST',
    });

    if (refreshResult.error) {
      clearSession(false);
      setIsLoading(false);

      return refreshResult;
    }

    const refreshedSession = extractAuthSession(refreshResult.data);

    if (refreshedSession.token && refreshedSession.user) {
      syncSession(refreshedSession.token, refreshedSession.user);
      setIsLoading(false);

      return refreshResult;
    }

    const meResult = await apiFetch('/auth/me');

    if (meResult.error) {
      clearSession(false);
      setIsLoading(false);

      return meResult;
    }

    const meSession = extractAuthSession(
      meResult.data,
      refreshedSession.token,
      refreshedSession.user
    );

    if (meSession.token && meSession.user) {
      syncSession(meSession.token, meSession.user);
    } else {
      clearSession(false);
    }

    setIsLoading(false);

    return meResult;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);

    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (!result.error) {
      const nextSession = extractAuthSession(result.data);
      if (nextSession.token && nextSession.user) {
        syncSession(nextSession.token, nextSession.user);
      }
    }

    setIsLoading(false);

    return result;
  };

  const signup = async (email, password, role) => {
    setIsLoading(true);

    const result = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { email, password, role },
    });

    if (!result.error) {
      const nextSession = extractAuthSession(result.data);

      if (nextSession.token && nextSession.user) {
        syncSession(nextSession.token, nextSession.user);
      }
    }

    setIsLoading(false);

    return result;
  };

  const logout = () => {
    clearSession(true);
  };

  const hasPermission = (requiredPermission) => {
    if (!requiredPermission) {
      return true;
    }

    const role = normalizePermission(user?.role);
    if (role === 'admin') {
      return true;
    }

    const permissions = Array.isArray(user?.permissions)
      ? user.permissions
          .filter((permission) => typeof permission === 'string')
          .map((permission) => normalizePermission(permission))
      : [];

    const requiredPermissions = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    if (requiredPermissions.length === 0) {
      return true;
    }

    return requiredPermissions
      .map((permission) => normalizePermission(permission))
      .every((permission) => permissions.includes(permission) || role === permission);
  };

  const contextValue = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    signup,
    logout,
    hasPermission,
    checkAuth,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/** @returns {import('./AuthContext').AuthContextValue} */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
