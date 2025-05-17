import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import InputField from "../components/InputField";
import { useErrorAlert } from "../contexts/ErrorAlertContext";

const SignUp = () => {
  const { showError, dismissError } = useErrorAlert();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const handleSignUp = async () => {
    if (!isLoaded) return;

    // Basic validation
    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email address");
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.fullName.split(" ")[0],
        lastName: form.fullName.split(" ").slice(1).join(" ") || "",
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
      if (pendingVerification) router.push("/(auth)/otp");
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      showError({ title: "Error", message: "Unknown error occurred" });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-5">
            <Text className="text-[32px] font-pbold text-primary">
              Register
            </Text>
            <Text className="text-[15px] font-pregular text-gray-500 mt-2">
              Create an account to continue
            </Text>
            {error ? (
              <Text className="text-red-500 text-[14px] font-pregular mt-2">
                {error}
              </Text>
            ) : null}
            <View className="mt-10 space-y-5">
              {/* Full Name */}
              <View className="gap-y-2">
                <Text className="text-sm font-pmedium text-gray-700">
                  Full Name
                </Text>
                <InputField
                  placeholder="Full Name"
                  value={form.fullName}
                  onChangeText={(text) => {
                    setForm({ ...form, fullName: text });
                    setError("");
                  }}
                  accessibilityLabel="Full Name"
                />
              </View>
              {/* Email */}
              <View className="gap-y-2">
                <Text className="text-sm font-pmedium text-gray-700">
                  Email
                </Text>
                <InputField
                  placeholder="Email"
                  value={form.email}
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    setError("");
                  }}
                  accessibilityLabel="Email"
                  keyboardType="email-address"
                />
              </View>
              {/* Password */}
              <View className="gap-y-2">
                <Text className="text-sm font-pmedium text-gray-700">
                  Password
                </Text>
                <InputField
                  secureTextEntry={true}
                  placeholder="Password"
                  value={form.password}
                  onChangeText={(text) => {
                    setForm({ ...form, password: text });
                    setError("");
                  }}
                  accessibilityLabel="Password"
                />
              </View>
              {/* Confirm Password */}
              <View className="gap-y-2">
                <Text className="text-sm font-pmedium text-gray-700">
                  Confirm Password
                </Text>
                <InputField
                  secureTextEntry={true}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChangeText={(text) => {
                    setForm({ ...form, confirmPassword: text });
                    setError("");
                  }}
                  accessibilityLabel="Confirm Password"
                />
              </View>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-xl h-[56px] mt-10 justify-center items-center"
              onPress={handleSignUp}
              accessible={true}
              accessibilityLabel="Register button"
            >
              <Text className="text-white font-pbold text-[16px]">
                Register
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center items-center mt-5">
              <Text className="text-[15px] font-pregular text-gray-500">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signin")}
                accessible={true}
                accessibilityLabel="Sign in link"
              >
                <Text className="text-primary font-pbold"> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
