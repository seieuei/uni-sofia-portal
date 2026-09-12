"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, Persona, Role, SessionUser } from "@/lib/types";
import { LANG_COOKIE } from "@/lib/types";
import { clearPersona, readPersona, writePersona } from "@/lib/persona";
import { pickLang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  user: SessionUser | null;
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  resetPersona: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  ready: boolean;
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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);

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
    const legacy = readPersona();
    setPersonaState(legacy);
    refreshUser().finally(() => setReady(true));
  }, [refreshUser]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_COOKIE, l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, []);

  const setPersona = useCallback((p: Persona) => {
    writePersona(p);
    setPersonaState(p);
  }, []);

  const resetPersona = useCallback(() => {
    clearPersona();
    setPersonaState(null);
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
    }),
    [lang, setLang, user, persona, setPersona, resetPersona, refreshUser, logout, ready]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside Providers");
  return ctx;
}
