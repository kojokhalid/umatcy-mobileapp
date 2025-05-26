import { Stack } from "expo-router";
import React from "react";

const SettingsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profilesettings" options={{ headerShown: false }} />
      <Stack.Screen name="changepassword" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SettingsLayout;
