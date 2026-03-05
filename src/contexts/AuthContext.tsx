import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

interface User {
  name: string;
  email: string;
  avatar: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          avatar: firebaseUser.displayName
            ? firebaseUser.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
            : "U",
          photoURL: firebaseUser.photoURL || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // Fallback for development/demo without Firebase config
      if (
        error.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key." ||
        error.code === "auth/invalid-api-key" ||
        error.code === "auth/configuration-not-found"
      ) {
        console.warn("Firebase not configured. Using demo mode.");
        setUser({
          name: "Demo User",
          email: "demo@aeroguardian.ai",
          avatar: "DU",
        });
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
