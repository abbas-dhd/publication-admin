import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type UserData } from "@/lib/api/authSendOTP";
// import { AuthResponse } from "../api/authApi";

export interface AuthContextType {
  user: UserData | null;
  setAuthData: (data: UserData) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, setAuthData, logout, isAuthenticated }}
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
