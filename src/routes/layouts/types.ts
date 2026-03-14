export interface AppNavContentProps {
  isAuthenticated: boolean;
  userEmail: string | null;
  onNavigate: () => void;
}
