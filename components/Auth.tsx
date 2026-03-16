import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Mangler info", "Skriv inn e-post og passord.");
      return;
    }
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) Alert.alert("Registrering feilet", error.message);
    if (!session) Alert.alert("Sjekk e-post", "Hvis e-postbekreftelse er på, må du bekrefte via e-post.");
    setLoading(false);
  }

  async function signInWithEmail() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Mangler info", "Skriv inn e-post og passord.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) Alert.alert("Innlogging feilet", error.message);
    setLoading(false);
  }

  const primaryAction = mode === "signin" ? signInWithEmail : signUpWithEmail;
  const primaryLabel = mode === "signin" ? "Logg inn" : "Registrer deg";

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {/* "Logo" */}
      <View style={{ alignItems: "center", marginBottom: 26 }}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "white",
              fontSize: 46,
              fontWeight: "900",
              letterSpacing: 2,
              lineHeight: 46,
              transform: [{ rotate: "-12deg" }],
              marginBottom: 6,
            }}
          >
            FAST
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 46,
              fontWeight: "900",
              letterSpacing: 2,
              lineHeight: 46,
            }}
          >
            NOTES
          </Text>
        </View>

        <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 10 }}>
          {mode === "signin" ? "Logg inn for å fortsette" : "Opprett en konto"}
        </Text>
      </View>

      {/* Inputs */}
      <View style={{ gap: 12 }}>
        <TextInput
          placeholder="E-post"
          placeholderTextColor="rgba(255,255,255,0.35)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: "#1f1f1f",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: "white",
          }}
        />

        <TextInput
            placeholder="Passord"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: "white",
            }}
          />
          
        <Pressable
          onPress={primaryAction}
          disabled={loading}
          style={{
            marginTop: 6,
            backgroundColor: "#FFD60A",
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ color: "#2a2a2a", fontWeight: "800", fontSize: 16 }}>
            {loading ? "Venter..." : primaryLabel}
          </Text>
        </Pressable>

        {/* Toggle */}
        {mode === "signin" ? (
          <Pressable onPress={() => setMode("signup")} style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              Ikke bruker? <Text style={{ color: "#FFD60A", fontWeight: "700" }}>Registrer deg</Text>
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setMode("signin")} style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              Allerede bruker? <Text style={{ color: "#FFD60A", fontWeight: "700" }}>Logg inn</Text>
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}