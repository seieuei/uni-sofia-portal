"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, Persona } from "@/lib/types";
import { LANG_COOKIE } from "@/lib/types";
import { clearPersona, readPersona, writePersona } from "@/lib/persona";
import { pickLang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  resetPersona: () => void;
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
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangState(readLang());
    setPersonaState(readPersona());
    setReady(true);
  }, []);

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

  const value = useMemo(
    () => ({ lang, setLang, persona, setPersona, resetPersona, ready }),
    [lang, setLang, persona, setPersona, resetPersona, ready]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside Providers");
  return ctx;
}
