import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const SettingsLayout = () => {
  return (
    <>
      <Stack>
        <StatusBar style="dark" />

        <Stack.Screen name="mainsettings" options={{ headerShown: false }} />
        <Stack.Screen name="profilesettings" options={{ headerShown: false }} />
        <Stack.Screen name="changepassword" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default SettingsLayout;

const styles = StyleSheet.create({});
