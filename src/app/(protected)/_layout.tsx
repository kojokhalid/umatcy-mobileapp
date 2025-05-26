import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
export default function Layout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
