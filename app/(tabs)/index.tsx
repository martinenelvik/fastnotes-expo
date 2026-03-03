import React, { useRef } from "react";
import { useNotesCtx } from "../../context/NotesContext";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import NoteRow from "../../components/NoteRow";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";
import type ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const ACTION_W = 84;

function SwipeNoteItem({
  item,
  onOpen,
  onDelete,
}: {
  item: any;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const swipeRef = useRef<any>(null);

  const renderRightActions = () => (
    <View
      style={{
        width: ACTION_W,
        height: "100%",
      }}
    >
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

  return (
  <View style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden" }}>
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <NoteRow
        title={item.title}
        preview={item.content}
        updatedAt={item.updatedAt}
        onPress={onOpen}
      />
    </Swipeable>
  </View>
  );
}

export default function NotesIndex() {
  const router = useRouter();
  const { notes, loaded, deleteNote } = useNotesCtx();

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

  function onNewNote() {
    const id = Date.now().toString();
    router.push({ pathname: "/note/[id]", params: { id } });
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
            <Text style={{ color: "white", fontSize: 34, fontWeight: "800" }}>
              Notes
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
            onDelete={() => deleteNote(item.id)}
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