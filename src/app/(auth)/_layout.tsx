import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Redirect, Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/contexts/AuthContext";

const AuthLayout = () => {
  const loggedin = false;
  const authState = useContext(AuthContext);
  if (authState.isLoggedIn) return <Redirect href={"/(tabs)/(home)"} />;
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
