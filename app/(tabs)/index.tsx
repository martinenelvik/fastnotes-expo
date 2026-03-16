import React, { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNotesCtx } from "../../context/NotesContext";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import NoteRow from "../../components/NoteRow";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Auth from "@/components/Auth";

const ACTION_W = 84;

function SwipeNoteItem({
  item,
  onOpen,
  onDelete,
  canDelete,
  currentUserId,
}: {
  item: any;
  onOpen: () => void;
  onDelete: () => void;
  canDelete: boolean;
  currentUserId: string | null;
}) {
  const swipeRef = useRef<any>(null);

  const isMine = item.user_id === currentUserId;

  const renderRightActions = () => {
  if (!canDelete) return null;

  return (
    <View style={{ width: ACTION_W, height: "100%" }}>
      <Pressable
        onPress={() => {
          swipeRef.current?.close();
          onDelete();
        }}
        style={{
          flex: 1,
          backgroundColor: "#E53935",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="trash-bin" size={22} color="white" />
      </Pressable>
    </View>
  );
};



  return (
    <View style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden" }}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
      >
        <View style={{ position: "relative" }}>
  <NoteRow
    title={item.title}
    preview={item.content}
    updatedAt={item.updatedAt}
    onPress={onOpen}
  />

  {isMine && (
    <View style={{ position: "absolute", right: 12, bottom: 10 }}>
      <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
        av deg
      </Text>
    </View>
  )}
</View>
      </Swipeable>
    </View>
  );
}

export default function NotesIndex() {
  const router = useRouter();
  const { notes, loaded, deleteNote, upsertNote, currentUserId } = useNotesCtx();

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function onSignOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: "#2a2a2a", paddingTop: 80, paddingHorizontal: 24 }}>
        <Auth />
      </View>
    );
  }

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1f1f1f",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", opacity: 0.8 }}>Loading…</Text>
      </View>
    );
  }

  async function onNewNote() {
    const created = await upsertNote({ title: "", content: "" });
    if (created?.id) {
      router.push({ pathname: "/note/[id]", params: { id: created.id } });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#2a2a2a" }}>
      <FlatList
        data={notes}
        keyExtractor={(n) => n.id}
        style={{ maxWidth: 600, alignSelf: "center", width: "100%" }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View style={{ paddingBottom: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 34, fontWeight: "800" }}>
                Jobb Notater
              </Text>

              <Pressable
                onPress={onSignOut}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#3a3a3a" }}
              >
                <Text style={{ color: "white" }}>Sign out</Text>
              </Pressable>
            </View>

            <Text style={{ color: "white", opacity: 0.55, marginTop: 6 }}>
      Logget inn som {session?.user?.email}
    </Text>

            <Text style={{ color: "white", opacity: 0.65, marginTop: 6 }}>
              {notes.length} notater
            </Text>
          </View>
        }
        renderItem={({ item }) => (
  <SwipeNoteItem
    item={item}
    onOpen={() =>
      router.push({
        pathname: "/note/[id]",
        params: { id: item.id },
      })
    }
    onDelete={() => {
      deleteNote(item.id);
      Alert.alert("Vellykket", "Notatet ble slettet.");
    }}
    canDelete={item.user_id === currentUserId}
    currentUserId={currentUserId}
  />
)}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, opacity: 0.75 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Ingen notater ennå
            </Text>
            <Text style={{ color: "white", marginTop: 6, opacity: 0.8 }}>
              Trykk på + for å lage et nytt notat.
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={onNewNote}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: "#FFD60A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={32} color="#2a2a2a" />
      </Pressable>
    </View>
  );
}