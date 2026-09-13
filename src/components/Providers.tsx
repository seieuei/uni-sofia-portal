"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, Persona, Role, SessionUser } from "@/lib/types";
import { LANG_COOKIE } from "@/lib/types";
import { clearPersona, readPersona, writePersona } from "@/lib/persona";
import { pickLang } from "@/lib/i18n";
import {
  applyTheme,
  persistTheme,
  readResolvedTheme,
  readSavedTheme,
  systemTheme,
  type ResolvedTheme,
} from "@/lib/theme";
import { persistVisitor, readVisitorCookie } from "@/lib/visitor";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: ResolvedTheme;
  setTheme: (t: ResolvedTheme) => void;
  toggleTheme: () => void;
  user: SessionUser | null;
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  resetPersona: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  ready: boolean;
  visitor: boolean;
  enterVisitor: () => void;
  exitVisitor: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

function readLang(): Lang {
  if (typeof window === "undefined") return "bg";
  const m = document.cookie.match(/(?:^|; )usp_lang=([^;]+)/);
  if (m) return pickLang(m[1]);
  const ls = localStorage.getItem(LANG_COOKIE);
  return pickLang(ls);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bg");
  const [theme, setThemeState] = useState<ResolvedTheme>("light");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);
  const [visitor, setVisitor] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me");
      const d = await r.json();
      const u = d.user as SessionUser | null;
      setUser(u);
      if (u) {
        const p: Persona = {
          role: u.role,
          facultyCode: u.facultyCode || "FCML",
          name: u.name,
          email: u.email,
        };
        writePersona(p);
        setPersonaState(p);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setLangState(readLang());
    setThemeState(readResolvedTheme());
    const legacy = readPersona();
    setPersonaState(legacy);
    setVisitor(readVisitorCookie());
    refreshUser().finally(() => setReady(true));
  }, [refreshUser]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readSavedTheme()) return;
      const next = systemTheme();
      applyTheme(next);
      setThemeState(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_COOKIE, l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, []);

  const setTheme = useCallback((next: ResolvedTheme) => {
    setThemeState(next);
    applyTheme(next);
    persistTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const setPersona = useCallback((p: Persona) => {
    writePersona(p);
    setPersonaState(p);
  }, []);

  const resetPersona = useCallback(() => {
    clearPersona();
    setPersonaState(null);
  }, []);

  const enterVisitor = useCallback(() => {
    persistVisitor(true);
    setVisitor(true);
  }, []);

  const exitVisitor = useCallback(() => {
    persistVisitor(false);
    setVisitor(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearPersona();
    setUser(null);
    setPersonaState(null);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      theme,
      setTheme,
      toggleTheme,
      user,
      persona: user
        ? {
            role: user.role as Role,
            facultyCode: user.facultyCode || "FCML",
            name: user.name,
            email: user.email,
          }
        : persona,
      setPersona,
      resetPersona,
      refreshUser,
      logout,
      ready,
      visitor: !user && visitor,
      enterVisitor,
      exitVisitor,
    }),
    [lang, setLang, theme, setTheme, toggleTheme, user, persona, setPersona, resetPersona, refreshUser, logout, ready, visitor, enterVisitor, exitVisitor]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside Providers");
  return ctx;
}
