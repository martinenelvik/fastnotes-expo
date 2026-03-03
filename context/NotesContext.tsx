import React, { createContext, useContext } from "react";
import { useNotes } from "@/hooks/UseNotes";

const NotesCtx = createContext<ReturnType<typeof useNotes> | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const value = useNotes();
  return <NotesCtx.Provider value={value}>{children}</NotesCtx.Provider>;
}

export function useNotesCtx() {
  const ctx = useContext(NotesCtx);
  if (!ctx) throw new Error("useNotesCtx må brukes inni NotesProvider");
  return ctx;
}


