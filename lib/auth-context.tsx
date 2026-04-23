"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import type { User as AppUser } from "./types";
import { createClient } from "./supabase/client";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(u: any, accessToken?: string): AppUser {
  const meta = u.user_metadata || {};
  const id = u.id;
  const email = u.email;
  const name = meta.name || meta.full_name || email.split("@")[0];
  const avatar = meta.avatar_url || meta.avatar;

  let role: "admin" | "user" = "user";
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      if (payload.user_role === "admin") role = "admin";
    } catch {}
  }

  let savedProperties: string[] = [];
  try {
    const raw = localStorage.getItem(`savedProperties:${id}`);
    if (raw) savedProperties = JSON.parse(raw);
  } catch {}

  return { id, name, email, avatar, role, savedProperties };
}

interface AuthProviderProps {
  children: ReactNode;
  initialSession?: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(
    initialSession?.user
      ? mapSupabaseUser(initialSession.user, initialSession.access_token)
      : null
  );

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user
            ? mapSupabaseUser(session.user, session.access_token)
            : null
        );
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) setUser(mapSupabaseUser(data.user, data.session?.access_token));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (data.user) setUser(mapSupabaseUser(data.user, data.session?.access_token));
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const toggleSaveProperty = useCallback((propertyId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const saved = prev.savedProperties.includes(propertyId)
        ? prev.savedProperties.filter((id) => id !== propertyId)
        : [...prev.savedProperties, propertyId];
      try {
        localStorage.setItem(`savedProperties:${prev.id}`, JSON.stringify(saved));
      } catch {}
      return { ...prev, savedProperties: saved };
    });
  }, []);

  const isPropertySaved = useCallback(
    (propertyId: string) => user?.savedProperties.includes(propertyId) ?? false,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        loginWithGoogle,
        register,
        logout,
        toggleSaveProperty,
        isPropertySaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}