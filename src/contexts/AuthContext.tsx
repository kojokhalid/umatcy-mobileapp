import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
};

type AuthContextType = {
  isLoggedIn: boolean | null;
  isEmailVerified: boolean | null;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  isReady: boolean;
  user?: UserType | undefined;
  setUser: (user: UserType | undefined) => void;
  setIsLoggedIn: (isLoggedIn: boolean | null) => void;
  setIsEmailVerified: (isEmailVerified: boolean | null) => void;
};

// Initialize context as undefined to enforce provider usage
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Custom hook to enforce context usage within provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const authKey = "authState";
  const router = useRouter();

  const storeAuthState = async (newState: {
    isLoggedIn: boolean | null;
    isEmailVerified: boolean | null;
  }) => {
    try {
      await AsyncStorage.setItem(authKey, JSON.stringify(newState));
    } catch (error) {
      console.error("Error storing auth state:", error);
    }
  };

  const getStoredAuthState = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(authKey);
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue);
        setIsLoggedIn(parsed.isLoggedIn);
        setIsEmailVerified(parsed.isEmailVerified);
      }
    } catch (error) {
      console.error("Error retrieving auth state:", error);
    }
  };

  const logIn = async () => {
    // try {
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   setIsLoggedIn(false);
    //   setIsEmailVerified(false);
    //   await storeAuthState({ isLoggedIn: false, isEmailVerified: false });
    //   router.replace("/login");
    // }
  };

  const logOut = async () => {
    try {
      await authClient.signOut(); // Adjust based on better-auth API
      setIsLoggedIn(false);
      setIsEmailVerified(false);
      await AsyncStorage.removeItem(authKey);
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Restore state from AsyncStorage
        await getStoredAuthState();

        // Validate with authClient
        const { data } = await authClient.getSession();
        console.log("Session data:", data);
        if (data?.user) {
          const verified = data.user.emailVerified ?? false;
          console.log("User email verified:", verified);
          if (verified) {
            setIsLoggedIn(true);
            await storeAuthState({
              isLoggedIn: true,
              isEmailVerified: verified,
            });
          } else {
            await storeAuthState({
              isLoggedIn: false,
              isEmailVerified: verified,
            });
          }
          setIsEmailVerified(verified);
          setUser(data.user);
          // Redirect based on verification status
          if (verified) {
            router.replace("/(protected)/(home)");
          } else {
            router.replace("/(auth)/otp");
          }
        } else {
          setIsLoggedIn(false);
          setIsEmailVerified(false);
          await AsyncStorage.removeItem(authKey);
          router.replace("/(auth)/signin");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoggedIn(false);
        setIsEmailVerified(false);
        await AsyncStorage.removeItem(authKey);
        router.replace("/(auth)/signin");
      } finally {
        setIsReady(true);
        console.log("authstatexxx", getStoredAuthState);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isEmailVerified,
        logIn,
        logOut,
        isReady,
        user,
        setUser,
        setIsLoggedIn,
        setIsEmailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
