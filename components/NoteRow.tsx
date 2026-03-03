import { Pressable, Text, View } from "react-native";

function timeAgo(ts: number) {
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return `${d} days ago`;
}

export default function NoteRow({
  title,
  preview,
  updatedAt,
  onPress,
}: {
  title: string;
  preview: string;
  updatedAt: number;
  onPress: () => void;
}) {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 14,   
          minHeight: 64,           
          justifyContent: "center"
        }}
      >
        <Text
          style={{ color: "white", fontSize: 18, fontWeight: "600" }}
          numberOfLines={1}
        >
          {title || "Untitled"}
        </Text>

        <Text
          style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}
          numberOfLines={2}
        >
          {preview || " "}
        </Text>

        <Text style={{ color: "rgba(255,255,255,0.45)", marginTop: 10, fontSize: 12 }}>
          {timeAgo(updatedAt)}
        </Text>
      </Pressable>

      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
      />
    </View>
  );
}