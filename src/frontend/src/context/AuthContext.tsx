import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { type UserProfile, UserRole } from "../backend.d";

export type AppPage =
  | "landing"
  | "auth"
  | "customer"
  | "shop-browser"
  | "shop-owner";

interface AuthContextValue {
  page: AppPage;
  setPage: (p: AppPage) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  myShopId: bigint | null;
  setMyShopId: (id: bigint | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  page: "landing",
  setPage: () => {},
  role: UserRole.guest,
  setRole: () => {},
  profile: null,
  setProfile: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  myShopId: null,
  setMyShopId: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<AppPage>("landing");
  const [role, setRole] = useState<UserRole>(UserRole.guest);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myShopId, setMyShopId] = useState<bigint | null>(null);

  const stablSetPage = useCallback(setPage, []);
  const stablSetRole = useCallback(setRole, []);

  return (
    <AuthContext.Provider
      value={{
        page,
        setPage: stablSetPage,
        role,
        setRole: stablSetRole,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        myShopId,
        setMyShopId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
