import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type UserData } from "@/lib/api/authSendOTP";
import { jwtDecode } from "jwt-decode";
// import { AuthResponse } from "../api/authApi";

export type TeamJWTPayload = {
  user_id: string;
  role_name: string;
  exp: number;
};

export interface AuthContextType {
  user: UserData | null;
  setAuthData: (data: UserData) => void;
  logout: () => boolean;
  isAuthenticated: () => boolean;
  getTokenPayload: () => TeamJWTPayload | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    // initialize from localStorage on first render
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as UserData;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("authUser");
      }
    }
    return null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  const setAuthData = (user: UserData) => {
    setUser(user);
    console.log("user set");
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const tokenPayload = () => {
    if (!user?.token) return null;
    return jwtDecode<TeamJWTPayload>(user.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");

    return true
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setAuthData,
        logout,
        isAuthenticated,
        getTokenPayload: tokenPayload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
