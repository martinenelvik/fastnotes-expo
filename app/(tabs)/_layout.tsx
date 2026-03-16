import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Jobb Notater",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

