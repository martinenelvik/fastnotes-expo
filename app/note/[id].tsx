import { useNotesCtx } from "../../context/NotesContext";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, Alert } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function NoteEditor() {
  const router = useRouter();

  

  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = String(id ?? "");

  const { getNote, upsertNote } = useNotesCtx();
  const existing = useMemo(
    () => (noteId ? getNote(noteId) : undefined),
    [noteId, getNote]
  );

  const bodyRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Track auto-title (for nye notater)
  const autoTitleUsedRef = useRef(false);

  useEffect(() => {
  if (!existing) return;

  setTitle(existing.title ?? "");
  setContent(existing.content ?? "");

  autoTitleUsedRef.current = true;
  }, [existing]);
  
  // Når vi åpner et eksisterende notat: fyll inn feltene
  useEffect(() => {
    if (!existing) return;

    setTitle(existing.title ?? "");
    setContent(existing.content ?? "");

    autoTitleUsedRef.current = true; // eksisterende notat => aldri auto-tittel
  }, [existing]);

  function onTitleSubmit() {
    bodyRef.current?.focus();
  }

  // Auto-tittel fra første linje i content
  useEffect(() => {
    if (autoTitleUsedRef.current) return;

    if (!title.trim() && content.trim()) {
      const firstLine = content.split("\n")[0].slice(0, 60);
      setTitle(firstLine);
      autoTitleUsedRef.current = true; // kjør kun én gang
    }
  }, [content, title]);

  

  function onBack() {
    router.back();
  }

  async function onSave() {
    if (!noteId) return;

    const hasText = title.trim().length > 0 || content.trim().length > 0;
    if (!hasText) {
      // Ikke lagre tomme notater
      router.back();
      return;
    }

    const saved = await upsertNote({
      id: noteId,
      title: title.trim(),
      content,
    });

    Alert.alert("Vellykket", "Notatet ble lagret.");
    router.back();
  }

  const isCreating = noteId === "new";
  const canSave = !isCreating && (title.trim().length > 0 || content.trim().length > 0);

  if (isCreating) {
  return (
    <View style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", opacity: 0.8 }}>Lager notat…</Text>
    </View>
  );
}

 return (
  <>
    {/* Stopper iOS "swipe back" som konflikter med Swipeable i lista */}
    <Stack.Screen options={{ gestureEnabled: false }} />

    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={52} // samme som paddingTop på containeren
    >
      <View style={{ flex: 1, paddingTop: 52 }}>
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <Pressable onPress={onBack} style={{ padding: 10 }}>
            <Text style={{ color: "white", fontSize: 18 }}>‹</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          {/* LAGRE */}
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            style={{ padding: 10, opacity: canSave ? 1 : 0.35 }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Lagre
            </Text>
          </Pressable>

          <Pressable style={{ padding: 10 }}>
            <Text style={{ color: "white", opacity: 0.8 }}>⋮</Text>
          </Pressable>
        </View>

        {/* Editor (scrollbar + følger tastatur) */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 140, // scrolle cursor over tastaturet
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
          <TextInput
            value={title}
            onChangeText={(t) => {
              autoTitleUsedRef.current = true;
              setTitle(t);
            }}
            placeholder="Tittel"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "700",
              paddingVertical: 10,
            }}
            returnKeyType="next"
            onSubmitEditing={onTitleSubmit}
            blurOnSubmit={false}
          />

          <TextInput
            ref={bodyRef}
            value={content}
            onChangeText={setContent}
            placeholder="Skriv noe…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={{
              color: "white",
              fontSize: 18,
              paddingVertical: 10,
              lineHeight: 24,
              minHeight: 400,
            }}
            multiline
            textAlignVertical="top"
            autoFocus={!existing}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </>
);
}