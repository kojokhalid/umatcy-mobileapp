import {
  createContext,
  useContext,
  useState,
  ReactNode,
  PropsWithChildren,
} from "react";
import { authClient } from "@/lib/auth-client";

type AuthContextType = {
  isLoggedIn: boolean;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>({
  isLoggedIn: false,
  logIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const logIn = async () => {
    setIsLoggedIn(true);
  };
  const logOut = async () => {
    setIsLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
