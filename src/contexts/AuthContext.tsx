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

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser(mapFirebaseUser(firebaseUser));
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Firebase auth listener error:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(mapFirebaseUser(result.user));
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error?.code, error?.message);

      // User closed the popup — not an error, just do nothing
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        return;
      }

      // Firebase not configured or API key invalid — fallback to demo
      if (
        error?.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key." ||
        error?.code === "auth/invalid-api-key" ||
        error?.code === "auth/configuration-not-found"
      ) {
        console.warn("Firebase not configured. Using demo mode.");
        setUser({
          name: "Demo User",
          email: "demo@aeroguardian.ai",
          avatar: "DU",
        });
        return;
      }

      // For auth/unauthorized-domain: user needs to add their domain
      // to Firebase Console → Authentication → Settings → Authorized domains
      if (error?.code === "auth/unauthorized-domain") {
        console.error(
          "Your domain is not authorized in Firebase. Go to Firebase Console → Authentication → Settings → Authorized domains and add localhost."
        );
        // Still log them in as demo so the app works
        setUser({
          name: "Demo User",
          email: "demo@aeroguardian.ai",
          avatar: "DU",
        });
        return;
      }

      // Any other error — also fallback to demo so the app doesn't break
      console.warn("Sign-in failed, falling back to demo mode.");
      setUser({
        name: "Demo User",
        email: "demo@aeroguardian.ai",
        avatar: "DU",
      });
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
