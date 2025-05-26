import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const OnboardingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="additionalinfo" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OnboardingLayout;
