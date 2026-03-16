import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
  updatedAt: number;
  user_id?: string;
};

function toMs(updated_at: string) {
  const s = /z$|[+\-]\d{2}:\d{2}$/i.test(updated_at) ? updated_at : `${updated_at}Z`;
  return Date.parse(s);
}

function mapNote(n: any): Note {
  return {
    id: n.id,
    title: n.title ?? "",
    content: n.content ?? "",
    updated_at: n.updated_at,
    updatedAt: toMs(n.updated_at),
    user_id: n.user_id,
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadNotes() {
    if (!session?.user) {
      setNotes([]);
      setLoaded(true);
      return;
    }

    setLoaded(false);

    const { data, error } = await supabase
      .from("notes")
      .select("id,title,content,updated_at,user_id")
      .order("updated_at", { ascending: false });

    if (error) {
      console.log("loadNotes error:", error);
      setNotes([]);
      setLoaded(true);
      return;
    }

    setNotes((data ?? []).map(mapNote));
    setLoaded(true);
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  function getNote(id: string) {
    return notes.find((n) => n.id === id);
  }

  async function upsertNote(input: { id?: string; title: string; content: string }) {
    if (!session?.user) return;

    const payload: any = {
      title: input.title,
      content: input.content,
      updated_at: new Date().toISOString(),
    };
    if (input.id) payload.id = input.id;

    const { data, error } = await supabase
      .from("notes")
      .upsert(payload)
      .select("id,title,content,updated_at,user_id")
      .single();

    if (error) {
      console.log("upsertNote error:", error);
      return;
    }

    const mapped = mapNote(data);

    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== mapped.id);
      return [mapped, ...filtered];
    });

    return mapped;
  }

  async function deleteNote(id: string) {
    if (!session?.user) return;

    const res = await supabase.from("notes").delete().eq("id", id);

    if (res.error) {
      console.log("deleteNote error:", res.error);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return useMemo(
    () => ({
      notes,
      loaded,
      getNote,
      upsertNote,
      deleteNote,
      reload: loadNotes,
      currentUserId: session?.user?.id ?? null,
    }),
    [notes, loaded, session?.user?.id]
  );
}