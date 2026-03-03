import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

const KEY = "fastnotes.notes.v1";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        setNotes(raw ? (JSON.parse(raw) as Note[]) : []);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify(notes));
  }, [notes, loaded]);

  function createNote() {
    const id = Date.now().toString();
    const newNote = {
      id,
      title: "",
      content: "",
      updatedAt: Date.now(),
  };
    setNotes((prev) => [newNote, ...prev]);
    return id;
  }

  function getNote(id: string) {
    return notes.find((n) => n.id === id);
  }

  function upsertNote(note: Note) {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      const next = exists ? prev.map((n) => (n.id === note.id ? note : n)) : [note, ...prev];
      // sortér nyeste øverst
      return next.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return { notes, createNote, getNote, upsertNote, deleteNote, loaded };
}
